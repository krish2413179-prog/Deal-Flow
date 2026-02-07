-- ============================================
-- INSURANCE CLAIM SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CLAIMS TABLE (Main table for all claims)
-- ============================================
CREATE TABLE claims (
  -- Primary identification
  id TEXT PRIMARY KEY DEFAULT 'CLM-' || LPAD(nextval('claims_id_seq')::TEXT, 3, '0'),
  
  -- Customer information
  customer_wallet TEXT NOT NULL,  -- Full wallet address for searching
  customer TEXT NOT NULL,         -- Shortened display (e.g., "0x742d...3f8a")
  customer_email TEXT,
  customer_phone TEXT,
  
  -- Claim details
  product TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'PENDING', 'APPROVED', 'REJECTED')),
  
  -- AI Processing
  ai_verification TEXT,
  ai_conversation_summary TEXT,  -- Summary of AI conversation for quick reference
  requires_human_review BOOLEAN DEFAULT false,  -- Flag for complex cases
  
  -- Blockchain
  tx_hash TEXT,
  
  -- Dates
  submitted_date DATE DEFAULT CURRENT_DATE,
  processed_date DATE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for auto-incrementing claim IDs
CREATE SEQUENCE IF NOT EXISTS claims_id_seq START 1;

-- Indexes for performance
CREATE INDEX idx_claims_customer_wallet ON claims(customer_wallet);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_timestamp ON claims(timestamp DESC);

-- ============================================
-- 2. CLAIM TIMELINE TABLE (Track claim progress)
-- ============================================
CREATE TABLE claim_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  
  -- Timeline step
  status TEXT NOT NULL,  -- e.g., "Submitted", "AI Verification", "Approved", "Payment Sent"
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_timeline_claim_id ON claim_timeline(claim_id);
CREATE INDEX idx_timeline_date ON claim_timeline(date DESC);

-- ============================================
-- 2.5 CLAIM CONVERSATIONS TABLE (AI conversation history)
-- ============================================
CREATE TABLE claim_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  
  -- Conversation details
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  message TEXT NOT NULL,
  
  -- AI metadata
  ai_model TEXT DEFAULT 'gemini',
  tokens_used INTEGER,
  
  -- Attachments/context
  attachments JSONB,  -- Store file URLs, image analysis results, etc.
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conversations_claim_id ON claim_conversations(claim_id);
CREATE INDEX idx_conversations_created_at ON claim_conversations(created_at DESC);

-- ============================================
-- 3. TRANSACTIONS TABLE (Fund locks and payouts)
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Transaction details
  type TEXT NOT NULL CHECK (type IN ('lock', 'payout')),
  amount NUMERIC NOT NULL,
  
  -- Company wallet (who locked the funds)
  company_wallet TEXT NOT NULL,
  
  -- Blockchain
  tx_hash TEXT,
  
  -- Related claim (for payouts)
  claim_id TEXT REFERENCES claims(id),
  
  -- Dates
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX idx_transactions_claim_id ON transactions(claim_id);
CREATE INDEX idx_transactions_company_wallet ON transactions(company_wallet);

-- ============================================
-- 4. FUND STATUS TABLE (Track locked funds)
-- ============================================
CREATE TABLE fund_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Fund tracking
  total_locked NUMERIC NOT NULL DEFAULT 0,
  total_paid_out NUMERIC NOT NULL DEFAULT 0,
  available NUMERIC GENERATED ALWAYS AS (total_locked - total_paid_out) STORED,
  
  -- Metadata
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial record
INSERT INTO fund_status (total_locked, total_paid_out) VALUES (0, 0);

-- ============================================
-- 5. SYSTEM STATUS TABLE (Monitor integrations)
-- ============================================
CREATE TABLE system_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Service details
  service_name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('operational', 'degraded', 'down')),
  latency TEXT,
  balance TEXT,
  
  -- Metadata
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO system_status (service_name, status, latency) VALUES
  ('Gemini AI', 'operational', '120ms'),
  ('Make.com Webhook', 'operational', '85ms'),
  ('Bot Wallet', 'operational', '0 CRO'),
  ('Cronos Network', 'operational', '2.1s');

-- ============================================
-- 6. COMPANIES TABLE (Registered companies)
-- ============================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Company details
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  company_wallet TEXT NOT NULL UNIQUE,
  industry TEXT,
  website TEXT,
  
  -- Terms and conditions
  terms_and_conditions TEXT NOT NULL,
  coverage_details TEXT,
  max_claim_amount NUMERIC,
  
  -- Fund tracking per company
  total_locked NUMERIC NOT NULL DEFAULT 0,
  total_paid_out NUMERIC NOT NULL DEFAULT 0,
  available NUMERIC GENERATED ALWAYS AS (total_locked - total_paid_out) STORED,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_companies_wallet ON companies(company_wallet);
CREATE INDEX idx_companies_active ON companies(is_active);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for claims table
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for companies table
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update fund status after transaction
CREATE OR REPLACE FUNCTION update_fund_status()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.type = 'lock' THEN
        UPDATE fund_status SET 
            total_locked = total_locked + NEW.amount,
            updated_at = NOW()
        WHERE id = (SELECT id FROM fund_status LIMIT 1);
    ELSIF NEW.type = 'payout' THEN
        UPDATE fund_status SET 
            total_paid_out = total_paid_out + NEW.amount,
            updated_at = NOW()
        WHERE id = (SELECT id FROM fund_status LIMIT 1);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for transactions table
CREATE TRIGGER update_fund_status_trigger AFTER INSERT ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_fund_status();

-- Function to update company funds after transaction
CREATE OR REPLACE FUNCTION update_company_funds()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.type = 'lock' THEN
        UPDATE companies SET 
            total_locked = total_locked + NEW.amount,
            updated_at = NOW()
        WHERE company_wallet = NEW.company_wallet;
    ELSIF NEW.type = 'payout' THEN
        UPDATE companies SET 
            total_paid_out = total_paid_out + NEW.amount,
            updated_at = NOW()
        WHERE company_wallet = NEW.company_wallet;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for company-specific fund tracking
CREATE TRIGGER update_company_funds_trigger AFTER INSERT ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_company_funds();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Allow public read on claims" ON claims FOR SELECT USING (true);
CREATE POLICY "Allow public read on timeline" ON claim_timeline FOR SELECT USING (true);
CREATE POLICY "Allow public read on conversations" ON claim_conversations FOR SELECT USING (true);
CREATE POLICY "Allow public read on transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow public read on fund_status" ON fund_status FOR SELECT USING (true);
CREATE POLICY "Allow public read on system_status" ON system_status FOR SELECT USING (true);
CREATE POLICY "Allow public read on companies" ON companies FOR SELECT USING (true);

-- Allow public insert (you may want to restrict this in production)
CREATE POLICY "Allow public insert on claims" ON claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on timeline" ON claim_timeline FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on conversations" ON claim_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on transactions" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on companies" ON companies FOR INSERT WITH CHECK (true);

-- Allow public update on fund_status
CREATE POLICY "Allow public update on fund_status" ON fund_status FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update on system_status" ON system_status FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update on companies" ON companies FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update on claims" ON claims FOR UPDATE USING (true) WITH CHECK (true);


-- ============================================
-- USEFUL QUERIES FOR AI CONVERSATION TRACKING
-- ============================================

-- Get claim with full conversation history
-- SELECT 
--   c.*,
--   json_agg(
--     json_build_object(
--       'role', cc.role,
--       'message', cc.message,
--       'created_at', cc.created_at,
--       'attachments', cc.attachments
--     ) ORDER BY cc.created_at
--   ) as conversation_history
-- FROM claims c
-- LEFT JOIN claim_conversations cc ON c.id = cc.claim_id
-- WHERE c.id = 'CLM-001'
-- GROUP BY c.id;

-- Get all pending claims with their latest conversation
-- SELECT 
--   c.id,
--   c.customer,
--   c.product,
--   c.amount,
--   c.created_at,
--   (
--     SELECT message 
--     FROM claim_conversations 
--     WHERE claim_id = c.id 
--     ORDER BY created_at DESC 
--     LIMIT 1
--   ) as last_message
-- FROM claims c
-- WHERE c.status = 'pending'
-- ORDER BY c.created_at DESC;

-- Insert a new conversation message (for AI to use)
-- INSERT INTO claim_conversations (claim_id, role, message, attachments)
-- VALUES (
--   'CLM-001',
--   'assistant',
--   'I have analyzed the damage photo. The shoe appears to be torn at the sole.',
--   '{"image_analysis": "torn_sole", "confidence": 0.95}'::jsonb
-- );

-- Get conversation context for AI (last 10 messages)
-- SELECT role, message, attachments, created_at
-- FROM claim_conversations
-- WHERE claim_id = 'CLM-001'
-- ORDER BY created_at DESC
-- LIMIT 10;

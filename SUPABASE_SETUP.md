# Supabase Setup Instructions

## 1. Get Your Supabase Anon Key

1. Go to your Supabase project: https://supabase.com/dashboard/project/ubftxzqlnfrbacnkhwnn
2. Click on "Settings" (gear icon) in the left sidebar
3. Click on "API"
4. Copy the `anon` `public` key
5. Update `src/lib/supabase.js` with your key

## 2. Create Database Tables

Run these SQL commands in your Supabase SQL Editor:

### Claims Table
```sql
CREATE TABLE claims (
  id TEXT PRIMARY KEY DEFAULT 'CLM-' || LPAD(nextval('claims_id_seq')::TEXT, 3, '0'),
  customer_wallet TEXT NOT NULL,
  customer TEXT,
  product TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tx_hash TEXT,
  ai_verification TEXT,
  submitted_date DATE DEFAULT CURRENT_DATE,
  processed_date DATE,
  customer_email TEXT,
  customer_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for claim IDs
CREATE SEQUENCE claims_id_seq START 1;

-- Create index for faster wallet lookups
CREATE INDEX idx_claims_customer_wallet ON claims(customer_wallet);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('lock', 'payout')),
  amount NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tx_hash TEXT,
  claim_id TEXT REFERENCES claims(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
```

### Timeline Table (for claim progress tracking)
```sql
CREATE TABLE claim_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id TEXT REFERENCES claims(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster claim timeline lookups
CREATE INDEX idx_timeline_claim_id ON claim_timeline(claim_id);
```

## 3. Insert Sample Data

```sql
-- Insert sample claims
INSERT INTO claims (
  id, customer_wallet, customer, product, amount, status, 
  timestamp, tx_hash, ai_verification, customer_email, customer_phone
) VALUES
  ('CLM-001', '0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a', '0x742d...3f8a', 'Nike Air Max', 500, 'approved', 
   '2026-02-06 14:23:00', '0xabc123def456789xyz', 'Shoe damage confirmed - Receipt verified',
   'customer@example.com', '+1 (555) 123-4567'),
  ('CLM-002', '0x8f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a', '0x8f3a...2b1c', 'Adidas Ultraboost', 750, 'pending',
   '2026-02-06 15:10:00', NULL, 'Processing...', 'user2@example.com', '+1 (555) 234-5678'),
  ('CLM-003', '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', '0x1a2b...9c8d', 'Puma Sneakers', 300, 'rejected',
   '2026-02-06 13:45:00', NULL, 'Insufficient damage evidence', 'user3@example.com', '+1 (555) 345-6789'),
  ('CLM-004', '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f', '0x5e6f...4d3c', 'Reebok Classic', 450, 'approved',
   '2026-02-06 12:30:00', '0x789xyz...abc123', 'Receipt verified, damage confirmed',
   'user4@example.com', '+1 (555) 456-7890');

-- Insert timeline for CLM-001
INSERT INTO claim_timeline (claim_id, status, date, completed) VALUES
  ('CLM-001', 'Submitted', '2026-02-06 14:20:00', true),
  ('CLM-001', 'AI Verification', '2026-02-06 14:21:00', true),
  ('CLM-001', 'Approved', '2026-02-06 14:22:00', true),
  ('CLM-001', 'Payment Sent', '2026-02-06 14:23:00', true);

-- Insert sample transactions
INSERT INTO transactions (type, amount, tx_hash, claim_id) VALUES
  ('lock', 5000, '0xabc...123', NULL),
  ('payout', 500, '0xdef...456', 'CLM-001'),
  ('lock', 3000, '0x789...xyz', NULL);
```

## 4. Enable Row Level Security (Optional but Recommended)

```sql
-- Enable RLS
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_timeline ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust based on your needs)
CREATE POLICY "Allow public read access" ON claims FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON claim_timeline FOR SELECT USING (true);

-- Allow authenticated users to insert (adjust based on your needs)
CREATE POLICY "Allow authenticated insert" ON claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON transactions FOR INSERT WITH CHECK (true);
```

## 5. Update Your Code

Replace `YOUR_SUPABASE_ANON_KEY` in `src/lib/supabase.js` with your actual anon key.

## 6. Test the Integration

1. Start your dev server: `npm run dev`
2. Navigate to `/businessdash` to see claims data
3. Navigate to `/consumerdash` and search with wallet: `0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a`

## Database Schema Overview

### Claims Table Fields:
- `id`: Unique claim identifier (CLM-001, CLM-002, etc.)
- `customer_wallet`: Full wallet address for searching
- `customer`: Shortened wallet display
- `product`: Product name
- `amount`: Claim amount in CRO
- `status`: pending | approved | rejected
- `timestamp`: When claim was created
- `tx_hash`: Blockchain transaction hash
- `ai_verification`: AI analysis result
- `customer_email`: Customer email
- `customer_phone`: Customer phone

### Transactions Table Fields:
- `type`: lock | payout
- `amount`: Transaction amount
- `tx_hash`: Blockchain transaction hash
- `claim_id`: Related claim (if payout)

### Timeline Table Fields:
- `claim_id`: Related claim
- `status`: Timeline step name
- `date`: When step occurred
- `completed`: Whether step is complete

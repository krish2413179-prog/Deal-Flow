# Claims Dashboard - Technical Documentation

## Overview
The Claims Dashboard is a comprehensive React application that provides real-time monitoring and management of insurance claims processed through an automated AI-powered workflow.

## Architecture

### Frontend Components
```
ClaimsDashboard (Main Container)
├── ClaimsOverview (Statistics Cards)
├── ClaimsTable (Interactive Data Table)
├── EmailModal (Claim Details Viewer)
└── AdminUtils (Database Management)
```

### Data Flow
1. **Real-time Data Fetching** - `useClaims` hook manages Supabase connection
2. **Live Updates** - Supabase realtime subscriptions for instant data sync
3. **Data Cleaning** - Removes quoted values from database entries
4. **State Management** - React hooks for component state and data flow

## Key Features

### 1. Real-time Statistics Dashboard
- **Total Claims**: Live count of all claims in system
- **Status Breakdown**: Approved, rejected, and pending counts
- **Financial Summary**: Total amount paid in CRO cryptocurrency
- **Recent Activity**: Latest 5 claims with status indicators

### 2. Interactive Claims Table
- **Search Functionality**: Filter by email, subject, or reason
- **Status Filtering**: Show all, approved, rejected, or pending claims
- **Column Sorting**: Click headers to sort by any field
- **Responsive Design**: Mobile-friendly table layout
- **Blockchain Links**: Direct links to Cronos blockchain explorer

### 3. Detailed Claim Viewer
- **Email Modal**: Full claim details in popup window
- **Status Indicators**: Color-coded status badges
- **Transaction Verification**: Blockchain transaction hash display
- **Formatted Content**: Clean presentation of claim information

### 4. Admin Management Tools
- **Connection Testing**: Verify database connectivity
- **Sample Data**: Insert test claims for development
- **Data Management**: Clear all claims with confirmation
- **System Status**: Integration monitoring and health checks

## Technical Implementation

### Database Integration
```javascript
// Supabase client configuration
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Real-time subscription
const subscription = supabase
  .channel('claims_changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, 
    (payload) => fetchClaims()
  )
  .subscribe();
```

### Data Cleaning
The system handles quoted values from the database:
```javascript
const cleanedData = data.map(claim => ({
  ...claim,
  status: claim.status?.replace(/"/g, '') || '',
  user_email: claim.user_email?.replace(/"/g, '') || ''
}));
```

### Status Management
Claims are processed with case-insensitive status handling:
```javascript
const approvedClaims = claims.filter(claim => 
  claim.status?.toLowerCase().replace(/"/g, '') === 'approved'
);
```

## Integration Points

### 1. Make.com Workflow
- **Email Monitoring**: Gmail integration for claim intake
- **AI Processing**: Gemini AI for claim analysis
- **Decision Logic**: Automated approval/rejection based on AI analysis
- **Payment Processing**: Tatum API for blockchain transactions

### 2. Supabase Database
- **Real-time Updates**: Instant data synchronization
- **PostgreSQL Backend**: Reliable data storage
- **Row Level Security**: Secure data access
- **API Integration**: RESTful and real-time APIs

### 3. Cronos Blockchain
- **Payment Processing**: CRO cryptocurrency transactions
- **Transaction Verification**: Immutable payment records
- **Explorer Integration**: Direct links to blockchain explorer
- **Wallet Management**: Automated payment distribution

## Environment Configuration

Required environment variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

```sql
CREATE TABLE claims (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('APPROVED', 'REJECTED', 'PENDING')),
  amount_paid NUMERIC DEFAULT 0,
  tx_hash TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE claims;
```

## Performance Considerations

### 1. Real-time Updates
- Efficient subscription management
- Automatic cleanup on component unmount
- Debounced data fetching to prevent excessive API calls

### 2. Data Handling
- Client-side filtering and sorting for responsive UI
- Lazy loading for large datasets
- Optimized re-renders with React hooks

### 3. Mobile Responsiveness
- Responsive table design with horizontal scrolling
- Touch-friendly interface elements
- Optimized for various screen sizes

## Error Handling

### 1. Database Errors
- Connection failure recovery
- User-friendly error messages
- Retry mechanisms for failed operations

### 2. Data Validation
- Input sanitization
- Type checking for numeric fields
- Status validation against allowed values

### 3. UI Error States
- Loading indicators during data fetching
- Empty state handling for no data
- Error boundaries for component failures

## Security Features

### 1. Data Protection
- Environment variable protection for API keys
- Supabase Row Level Security policies
- Input sanitization and validation

### 2. Blockchain Security
- Transaction hash verification
- Immutable payment records
- Secure wallet integration

## Monitoring and Analytics

### 1. System Health
- Database connection monitoring
- Real-time subscription status
- Error tracking and logging

### 2. Business Metrics
- Claim processing statistics
- Payment volume tracking
- Status distribution analysis

## Future Enhancements

### 1. Advanced Features
- Claim history tracking
- Automated reporting
- Advanced filtering options
- Export functionality

### 2. Integration Improvements
- Multi-blockchain support
- Enhanced AI analysis
- Advanced notification system
- Mobile application

### 3. Performance Optimizations
- Caching strategies
- Database indexing
- CDN integration
- Progressive loading
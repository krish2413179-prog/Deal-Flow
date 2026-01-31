# Deal Flow - Insurance Claims Dashboard

A comprehensive React-based dashboard for managing insurance claims with real-time data integration, blockchain payments, and AI-powered processing.

## Features

### 🎯 Core Functionality
- **Real-time Claims Dashboard** - Live statistics and data updates
- **Interactive Claims Table** - Filtering, sorting, and search capabilities
- **Email Modal Viewer** - Detailed claim information display
- **Admin Utilities** - Database management and testing tools

### 🔗 System Integration
- **Supabase Database** - Real-time data storage and synchronization
- **Make.com Workflow** - Automated email processing
- **Gemini AI** - Intelligent claim analysis and decision making
- **Cronos Blockchain** - Secure cryptocurrency payments via Tatum API
- **Gmail Integration** - Automatic claim intake from support emails

### 📊 Dashboard Components
- **Claims Overview** - Statistics cards showing total, approved, rejected, and pending claims
- **Claims Table** - Sortable table with status filtering and transaction links
- **Email Modal** - Detailed view of claim information and blockchain verification
- **Admin Panel** - Tools for data management, testing, and system monitoring

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Real-time**: Supabase Realtime subscriptions
- **Blockchain**: Cronos network via Tatum API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and project
- Environment variables configured

### Installation

1. Clone the repository
```bash
git clone https://github.com/krish2413179-prog/Deal-Flow.git
cd Deal-Flow/deal-frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

## Database Schema

The application expects a `claims` table in Supabase with the following structure:

```sql
CREATE TABLE claims (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  amount_paid NUMERIC DEFAULT 0,
  tx_hash TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Workflow Integration

### Email Processing Flow
1. **Gmail Trigger** - Monitors support email inbox
2. **AI Analysis** - Gemini processes claim photos and receipts
3. **Policy Lookup** - Checks company policies in Supabase
4. **Decision Engine** - AI determines approval/rejection
5. **Payment Processing** - Tatum API handles blockchain transactions
6. **Database Update** - Claim records stored in Supabase
7. **User Notification** - Automated email responses with transaction proof

### Data Flow
```
Email → Make.com → Gemini AI → Supabase → Tatum/Cronos → Dashboard
```

## Features in Detail

### Real-time Statistics
- Total claims count
- Approved/rejected/pending breakdowns
- Total amount paid in CRO
- Live updates via Supabase subscriptions

### Interactive Table
- Search across email, subject, and reason fields
- Filter by claim status
- Sort by any column
- Direct links to blockchain transactions
- Responsive design for mobile devices

### Admin Tools
- Database connection testing
- Sample data insertion for development
- Bulk data clearing (with confirmation)
- System integration status monitoring

### Blockchain Integration
- Transaction hash verification
- Direct links to CronosScan explorer
- Immutable payment records
- Cryptocurrency payment processing

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/
│   └── dashboard/
│       ├── ClaimsDashboard.jsx    # Main dashboard component
│       ├── ClaimsOverview.jsx     # Statistics cards
│       ├── ClaimsTable.jsx        # Interactive table
│       ├── EmailModal.jsx         # Claim details modal
│       └── AdminUtils.jsx         # Admin tools
├── hooks/
│   └── useClaims.js              # Claims data management
├── utils/
│   ├── supabaseClient.js         # Database client
│   └── sampleData.js             # Test data
└── App.jsx                       # Main application
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.
export const sampleClaims = [
  {
    user_email: 'john.doe@example.com',
    subject: 'Claim for damaged Nike Air Max shoes',
    status: 'APPROVED',
    amount_paid: 150.00,
    tx_hash: '0x1234567890abcdef1234567890abcdef12345678',
    reason: 'Product arrived damaged with visible tears on the upper material. Receipt and photos provided as evidence.'
  },
  {
    user_email: 'jane.smith@example.com',
    subject: 'Refund request for defective Samsung phone',
    status: 'REJECTED',
    amount_paid: 0,
    tx_hash: null,
    reason: 'Insufficient evidence provided. Photos do not clearly show the claimed defect.'
  },
  {
    user_email: 'mike.johnson@example.com',
    subject: 'Insurance claim for broken laptop screen',
    status: 'APPROVED',
    amount_paid: 300.50,
    tx_hash: '0xabcdef1234567890abcdef1234567890abcdef12',
    reason: 'Clear evidence of accidental damage. Valid receipt and warranty information provided.'
  },
  {
    user_email: 'sarah.wilson@example.com',
    subject: 'Claim for water-damaged headphones',
    status: 'PENDING',
    amount_paid: 0,
    tx_hash: null,
    reason: 'Under review. Additional documentation requested from customer.'
  },
  {
    user_email: 'david.brown@example.com',
    subject: 'Refund for cancelled flight booking',
    status: 'APPROVED',
    amount_paid: 450.75,
    tx_hash: '0x9876543210fedcba9876543210fedcba98765432',
    reason: 'Flight cancelled by airline. Valid booking confirmation and cancellation notice provided.'
  },
  {
    user_email: 'lisa.garcia@example.com',
    subject: 'Warranty claim for malfunctioning smartwatch',
    status: 'REJECTED',
    amount_paid: 0,
    tx_hash: null,
    reason: 'Product is outside warranty period. Purchase date exceeds coverage terms.'
  },
  {
    user_email: 'robert.taylor@example.com',
    subject: 'Insurance claim for stolen bicycle',
    status: 'APPROVED',
    amount_paid: 800.00,
    tx_hash: '0x5555666677778888999900001111222233334444',
    reason: 'Police report filed. Valid proof of purchase and theft documentation provided.'
  },
  {
    user_email: 'emily.davis@example.com',
    subject: 'Refund request for defective kitchen appliance',
    status: 'PENDING',
    amount_paid: 0,
    tx_hash: null,
    reason: 'Claim under investigation. Awaiting manufacturer response.'
  }
];
import React from 'react';

const EmailModal = ({ claim, onClose }) => {
  if (!claim) return null;

  const cleanValue = (value) => {
    if (typeof value === 'string') {
      return value.replace(/"/g, '');
    }
    return value || 'N/A';
  };

  const getStatusColor = (status) => {
    const cleanStatus = cleanValue(status).toLowerCase();
    switch (cleanStatus) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Claim Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {cleanValue(claim.user_email)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(claim.status)}`}>
                  {cleanValue(claim.status)}
                </span>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                {cleanValue(claim.subject)}
              </p>
            </div>

            {/* Reason */}
            {claim.reason && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason/Details
                </label>
                <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                  {cleanValue(claim.reason)}
                </div>
              </div>
            )}

            {/* Financial Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {claim.amount_paid ? `${parseFloat(claim.amount_paid).toFixed(2)} CRO` : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Hash
                </label>
                {claim.tx_hash ? (
                  <a
                    href={`https://cronos.org/explorer/tx/${claim.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline bg-gray-50 p-2 rounded block break-all"
                  >
                    {claim.tx_hash}
                  </a>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                    No transaction hash
                  </p>
                )}
              </div>
            </div>

            {/* Blockchain Link */}
            {claim.tx_hash && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">🔗</span>
                  <span className="text-sm font-medium text-blue-900">Blockchain Verification</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  This transaction is recorded on the Cronos blockchain and can be verified independently.
                </p>
                <a
                  href={`https://cronos.org/explorer/tx/${claim.tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  View on CronosScan Explorer →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
import React from 'react';

const ClaimsOverview = ({ claims, loading }) => {
  // Calculate statistics
  const totalClaims = claims.length;
  const approvedClaims = claims.filter(claim => 
    claim.status?.toLowerCase().replace(/"/g, '') === 'approved'
  ).length;
  const rejectedClaims = claims.filter(claim => 
    claim.status?.toLowerCase().replace(/"/g, '') === 'rejected'
  ).length;
  const pendingClaims = claims.filter(claim => 
    claim.status?.toLowerCase().replace(/"/g, '') === 'pending'
  ).length;
  
  const totalPaid = claims
    .filter(claim => claim.status?.toLowerCase().replace(/"/g, '') === 'approved')
    .reduce((sum, claim) => sum + (parseFloat(claim.amount_paid) || 0), 0);

  const stats = [
    {
      title: 'Total Claims',
      value: totalClaims,
      icon: '📋',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Approved',
      value: approvedClaims,
      icon: '✅',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Rejected',
      value: rejectedClaims,
      icon: '❌',
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Pending',
      value: pendingClaims,
      icon: '⏳',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Paid',
      value: `${totalPaid.toFixed(2)} CRO`,
      icon: '💰',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-md p-3 mr-4`}>
                <span className="text-white text-xl">{stat.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Claims */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Claims</h3>
        </div>
        <div className="p-6">
          {claims.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📋</div>
              <p className="text-gray-500">No claims found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {claims.slice(0, 5).map((claim, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{claim.user_email}</p>
                    <p className="text-sm text-gray-600">{claim.subject}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      claim.status?.toLowerCase().replace(/"/g, '') === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : claim.status?.toLowerCase().replace(/"/g, '') === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {claim.status?.replace(/"/g, '') || 'Unknown'}
                    </span>
                    {claim.amount_paid && (
                      <span className="text-sm font-medium text-gray-900">
                        {parseFloat(claim.amount_paid).toFixed(2)} CRO
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimsOverview;
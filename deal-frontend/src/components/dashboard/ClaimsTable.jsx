import React, { useState } from 'react';
import EmailModal from './EmailModal';

const ClaimsTable = ({ claims, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [sortField, setSortField] = useState('user_email');
  const [sortDirection, setSortDirection] = useState('asc');

  // Clean and filter claims
  const filteredClaims = claims
    .filter(claim => {
      const matchesSearch = claim.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           claim.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           claim.reason?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const cleanStatus = claim.status?.toLowerCase().replace(/"/g, '') || '';
      const matchesStatus = statusFilter === 'all' || cleanStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      
      // Clean quoted values
      if (typeof aVal === 'string') aVal = aVal.replace(/"/g, '');
      if (typeof bVal === 'string') bVal = bVal.replace(/"/g, '');
      
      if (sortField === 'amount_paid') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getStatusBadge = (status) => {
    const cleanStatus = status?.toLowerCase().replace(/"/g, '') || 'unknown';
    const statusConfig = {
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      unknown: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' }
    };
    
    const config = statusConfig[cleanStatus] || statusConfig.unknown;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h3 className="text-lg font-medium text-gray-900">Claims Table</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('user_email')}
              >
                Email {getSortIcon('user_email')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('subject')}
              >
                Subject {getSortIcon('subject')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount_paid')}
              >
                Amount {getSortIcon('amount_paid')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClaims.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="text-gray-400 text-4xl mb-4">📋</div>
                  <p className="text-gray-500">No claims found</p>
                </td>
              </tr>
            ) : (
              filteredClaims.map((claim, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.user_email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={claim.subject}>
                      {claim.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(claim.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.amount_paid ? `${parseFloat(claim.amount_paid).toFixed(2)} CRO` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {claim.tx_hash ? (
                      <a
                        href={`https://cronos.org/explorer/tx/${claim.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                        title="View on CronosScan"
                      >
                        {claim.tx_hash.substring(0, 10)}...
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedEmail(claim)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      title="View email details"
                    >
                      <span>📄</span>
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-700">
          Showing {filteredClaims.length} of {claims.length} claims
        </p>
      </div>

      {/* Email Modal */}
      {selectedEmail && (
        <EmailModal
          claim={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </div>
  );
};

export default ClaimsTable;
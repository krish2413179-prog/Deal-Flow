import React, { useState } from 'react';
import ClaimsOverview from './ClaimsOverview';
import ClaimsTable from './ClaimsTable';
import AdminUtils from './AdminUtils';
import { useClaims } from '../../hooks/useClaims';

const ClaimsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { claims, loading, error, refreshClaims } = useClaims();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'claims', label: 'Claims', icon: '📋' },
    { id: 'admin', label: 'Admin', icon: '⚙️' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error Loading Dashboard</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refreshClaims}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Claims Dashboard</h1>
              <p className="text-gray-600">Insurance Claims Processing System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <button
                onClick={refreshClaims}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? '🔄' : '↻'} Refresh
              </button>
            </div>
          </div>
          
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <ClaimsOverview claims={claims} loading={loading} />}
        {activeTab === 'claims' && <ClaimsTable claims={claims} loading={loading} />}
        {activeTab === 'admin' && <AdminUtils onDataChange={refreshClaims} />}
      </div>
    </div>
  );
};

export default ClaimsDashboard;
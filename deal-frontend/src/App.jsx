import React, { useState } from 'react';
import ClaimsDashboard from './components/dashboard/ClaimsDashboard';
import Knowmore from './components/Knowmore';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      {activeTab === 'dashboard' ? (
        <ClaimsDashboard />
      ) : (
        <Knowmore />
      )}
      
      {/* Tab Navigation */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              activeTab === 'dashboard'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('knowmore')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              activeTab === 'knowmore'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ℹ️ Know More
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
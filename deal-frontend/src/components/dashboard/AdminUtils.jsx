import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { sampleClaims } from '../../utils/sampleData';

const AdminUtils = ({ onDataChange }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 5000);
  };

  const insertSampleData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('claims')
        .insert(sampleClaims);

      if (error) throw error;

      showMessage(`Successfully inserted ${sampleClaims.length} sample claims`, 'success');
      onDataChange?.();
    } catch (error) {
      console.error('Error inserting sample data:', error);
      showMessage(`Error inserting sample data: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    if (!window.confirm('Are you sure you want to delete ALL claims? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('claims')
        .delete()
        .neq('id', 0); // Delete all records

      if (error) throw error;

      showMessage('Successfully cleared all claims data', 'success');
      onDataChange?.();
    } catch (error) {
      console.error('Error clearing data:', error);
      showMessage(`Error clearing data: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('count(*)', { count: 'exact' });

      if (error) throw error;

      showMessage(`Database connection successful. Found ${data.length} claims.`, 'success');
    } catch (error) {
      console.error('Error testing connection:', error);
      showMessage(`Database connection failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const MessageAlert = ({ message }) => {
    if (!message) return null;

    const bgColor = {
      success: 'bg-green-100 border-green-400 text-green-700',
      error: 'bg-red-100 border-red-400 text-red-700',
      info: 'bg-blue-100 border-blue-400 text-blue-700'
    }[message.type] || 'bg-gray-100 border-gray-400 text-gray-700';

    return (
      <div className={`border px-4 py-3 rounded mb-4 ${bgColor}`}>
        {message.text}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Utilities</h3>
        <p className="text-sm text-gray-600 mb-6">
          Use these tools to manage the claims database. Be careful with destructive operations.
        </p>

        <MessageAlert message={message} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">🧪 Test Connection</h4>
            <p className="text-sm text-gray-600 mb-4">
              Test the database connection and get current record count.
            </p>
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">📊 Sample Data</h4>
            <p className="text-sm text-gray-600 mb-4">
              Insert sample claims data for testing the dashboard.
            </p>
            <button
              onClick={insertSampleData}
              disabled={loading}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Inserting...' : 'Insert Sample Data'}
            </button>
          </div>

          <div className="border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">🗑️ Clear Data</h4>
            <p className="text-sm text-red-600 mb-4">
              Delete all claims from the database. This cannot be undone!
            </p>
            <button
              onClick={clearAllData}
              disabled={loading}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? 'Clearing...' : 'Clear All Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Database Schema Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Database Schema</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Claims Table Structure:</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div><code className="bg-gray-200 px-1 rounded">user_email</code> - text (Email address of claimant)</div>
            <div><code className="bg-gray-200 px-1 rounded">subject</code> - text (Email subject line)</div>
            <div><code className="bg-gray-200 px-1 rounded">status</code> - text (APPROVED, REJECTED, PENDING)</div>
            <div><code className="bg-gray-200 px-1 rounded">amount_paid</code> - numeric (Amount in CRO)</div>
            <div><code className="bg-gray-200 px-1 rounded">tx_hash</code> - text (Blockchain transaction hash)</div>
            <div><code className="bg-gray-200 px-1 rounded">reason</code> - text (Claim details/reason)</div>
          </div>
        </div>
      </div>

      {/* Integration Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Integration</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">📧</span>
            <div>
              <h4 className="font-medium text-gray-900">Email Processing</h4>
              <p className="text-sm text-gray-600">
                Claims are automatically processed from Gmail via Make.com workflow
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h4 className="font-medium text-gray-900">AI Analysis</h4>
              <p className="text-sm text-gray-600">
                Gemini AI analyzes claim photos and receipts for approval decisions
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">⛓️</span>
            <div>
              <h4 className="font-medium text-gray-900">Blockchain Payments</h4>
              <p className="text-sm text-gray-600">
                Approved claims are paid via Tatum API on Cronos blockchain
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💾</span>
            <div>
              <h4 className="font-medium text-gray-900">Data Storage</h4>
              <p className="text-sm text-gray-600">
                All claim records are stored in Supabase with real-time updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUtils;
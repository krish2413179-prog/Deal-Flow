import React from 'react';

const Knowmore = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Deal Flow
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Insurance Claims Processing System
          </p>
        </div>

        <div className="space-y-8">
          {/* System Overview */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚀 System Overview
            </h2>
            <p className="text-gray-700 mb-4">
              Deal Flow is an automated insurance claims processing system that combines AI analysis, 
              blockchain payments, and real-time dashboard monitoring to streamline the entire claims workflow.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-semibold text-gray-900">AI-Powered Analysis</h3>
                  <p className="text-sm text-gray-600">Gemini AI analyzes claim photos and receipts automatically</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⛓️</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Blockchain Payments</h3>
                  <p className="text-sm text-gray-600">Secure CRO payments via Cronos blockchain</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Real-time Dashboard</h3>
                  <p className="text-sm text-gray-600">Live monitoring and management interface</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📧</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Integration</h3>
                  <p className="text-sm text-gray-600">Automated claim intake from Gmail</p>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Process */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🔄 Claims Processing Workflow
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Monitoring</h3>
                  <p className="text-sm text-gray-600">Gmail watches for new claim emails with attachments</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                  <p className="text-sm text-gray-600">Gemini AI analyzes photos, receipts, and claim details</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Policy Verification</h3>
                  <p className="text-sm text-gray-600">System checks company policies and coverage terms</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Processing</h3>
                  <p className="text-sm text-gray-600">Approved claims trigger automatic CRO payments</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg">
                <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">5</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Record Keeping</h3>
                  <p className="text-sm text-gray-600">All data stored in Supabase with blockchain proof</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🛠️ Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-2">⚛️</div>
                <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>React 18</li>
                  <li>Vite</li>
                  <li>Tailwind CSS</li>
                  <li>Lucide Icons</li>
                </ul>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-2">🗄️</div>
                <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Supabase</li>
                  <li>PostgreSQL</li>
                  <li>Real-time API</li>
                  <li>Make.com</li>
                </ul>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-2">🔗</div>
                <h3 className="font-semibold text-gray-900 mb-2">Blockchain</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Cronos Network</li>
                  <li>Tatum API</li>
                  <li>CRO Payments</li>
                  <li>Transaction Proof</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ✨ Key Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Automated Processing</h3>
                    <p className="text-sm text-gray-600">Reduces manual work by 90% with AI-powered analysis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Payments</h3>
                    <p className="text-sm text-gray-600">Blockchain payments processed in minutes, not days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Transparent Records</h3>
                    <p className="text-sm text-gray-600">Immutable blockchain proof for all transactions</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-time Monitoring</h3>
                    <p className="text-sm text-gray-600">Live dashboard with instant updates and notifications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Scalable Architecture</h3>
                    <p className="text-sm text-gray-600">Cloud-based system handles thousands of claims</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Cost Effective</h3>
                    <p className="text-sm text-gray-600">Reduces operational costs by up to 70%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Transform Your Claims Process?
            </h2>
            <p className="text-blue-100 mb-6">
              Experience the future of insurance claims processing with AI, blockchain, and real-time monitoring.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://github.com/krish2413179-prog/Deal-Flow"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View on GitHub
              </a>
              <button className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Knowmore;
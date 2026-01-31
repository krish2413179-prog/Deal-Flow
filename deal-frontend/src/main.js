// Simple vanilla JS version for testing
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  
  root.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #2563eb;">Deal Flow - Claims Dashboard</h1>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>🚀 Dashboard Status</h2>
        <p>✅ Basic HTML structure loaded</p>
        <p>✅ JavaScript execution working</p>
        <p>⚠️ React components need to be fixed</p>
      </div>
      
      <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📋 Claims Dashboard Features</h3>
        <ul>
          <li>Real-time claims monitoring</li>
          <li>Interactive data table</li>
          <li>Status filtering and search</li>
          <li>Blockchain transaction links</li>
          <li>Admin management tools</li>
        </ul>
      </div>
      
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🔧 Next Steps</h3>
        <ol>
          <li>Set up Supabase environment variables</li>
          <li>Fix React JSX compilation issues</li>
          <li>Test with sample data</li>
          <li>Connect to Make.com workflow</li>
        </ol>
      </div>
      
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📊 Sample Dashboard Preview</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 16px 0;">
          <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="color: #3b82f6; font-size: 24px;">📋</div>
            <div style="font-weight: bold; margin: 8px 0;">Total Claims</div>
            <div style="font-size: 24px; color: #1f2937;">42</div>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="color: #10b981; font-size: 24px;">✅</div>
            <div style="font-weight: bold; margin: 8px 0;">Approved</div>
            <div style="font-size: 24px; color: #1f2937;">28</div>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="color: #ef4444; font-size: 24px;">❌</div>
            <div style="font-weight: bold; margin: 8px 0;">Rejected</div>
            <div style="font-size: 24px; color: #1f2937;">8</div>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="color: #8b5cf6; font-size: 24px;">💰</div>
            <div style="font-weight: bold; margin: 8px 0;">Total Paid</div>
            <div style="font-size: 24px; color: #1f2937;">1,250 CRO</div>
          </div>
        </div>
      </div>
    </div>
  `;
});import React from 'react';
  
  const Main = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default Main;
  
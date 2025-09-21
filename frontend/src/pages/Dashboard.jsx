import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    pendingMappings: 0,
    billableAmount: 0,
    draftInvoices: 0,
    totalStudies: 0
  });

  // Simulate fetching metrics
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    const sampleMetrics = {
      pendingMappings: 24,
      billableAmount: 124500,
      draftInvoices: 8,
      totalStudies: 1245
    };
    setMetrics(sampleMetrics);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Studies</h2>
          <p className="text-3xl font-bold text-indigo-600">{metrics.totalStudies.toLocaleString()}</p>
          <p className="text-gray-500">In database</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Mappings</h2>
          <p className="text-3xl font-bold text-yellow-600">{metrics.pendingMappings}</p>
          <p className="text-gray-500">Studies need mapping</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Billable Amount</h2>
          <p className="text-3xl font-bold text-green-600">৳{metrics.billableAmount.toLocaleString()}</p>
          <p className="text-gray-500">This month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Draft Invoices</h2>
          <p className="text-3xl font-bold text-blue-600">{metrics.draftInvoices}</p>
          <p className="text-gray-500">Pending review</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Popular Diagnostic Center Rangpur</p>
                  <p className="text-gray-500 text-sm">150 studies • 2 hours ago</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Lab Aid Dinajpur</p>
                  <p className="text-gray-500 text-sm">85 studies • 1 day ago</p>
                </div>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Processing</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Lions Eye Hospital</p>
                  <p className="text-gray-500 text-sm">210 studies • 2 days ago</p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Uploaded</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Invoice #INV-2023-001</p>
                <p className="text-gray-500 text-sm">Lab Aid Dinajpur • ৳1,24,500</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Paid</span>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Invoice #INV-2023-002</p>
                <p className="text-gray-500 text-sm">Popular Diagnostic Center • ৳89,200</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Final</span>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Invoice #INV-2023-003</p>
                <p className="text-gray-500 text-sm">Lions Eye Hospital • ৳1,56,800</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Draft</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="font-medium">Database</h3>
            </div>
            <p className="text-gray-500 text-sm mt-2">Connected and operational</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="font-medium">File Processing</h3>
            </div>
            <p className="text-gray-500 text-sm mt-2">No issues detected</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="font-medium">API</h3>
            </div>
            <p className="text-gray-500 text-sm mt-2">All endpoints responding</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
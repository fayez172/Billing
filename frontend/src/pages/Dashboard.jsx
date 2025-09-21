import React from 'react'

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Mappings</h2>
          <p className="text-3xl font-bold text-indigo-600">24</p>
          <p className="text-gray-500">Studies need mapping</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Billable Amount</h2>
          <p className="text-3xl font-bold text-green-600">৳1,24,500</p>
          <p className="text-gray-500">This month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Draft Invoices</h2>
          <p className="text-3xl font-bold text-yellow-600">8</p>
          <p className="text-gray-500">Pending review</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          <li className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">File uploaded successfully</p>
              <p className="text-gray-500 text-sm">2 hours ago</p>
            </div>
          </li>
          <li className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">New mapping added for CT Head</p>
              <p className="text-gray-500 text-sm">1 day ago</p>
            </div>
          </li>
          <li className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">Invoice #INV-2023-001 finalized</p>
              <p className="text-gray-500 text-sm">2 days ago</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
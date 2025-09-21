import React, { useState, useEffect } from 'react'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { id: 1, username: 'admin', email: 'admin@billing.com', role: 'admin', active: true },
        { id: 2, username: 'billing1', email: 'billing1@billing.com', role: 'billing', active: true },
        { id: 3, username: 'billing2', email: 'billing2@billing.com', role: 'billing', active: true }
      ])
      
      setAuditLogs([
        { id: 1, user: 'admin', action: 'CREATE_INVOICE', table: 'invoices', timestamp: '2023-06-15 10:30:00' },
        { id: 2, user: 'billing1', action: 'UPLOAD_FILE', table: 'studies', timestamp: '2023-06-15 09:15:00' },
        { id: 3, user: 'admin', action: 'UPDATE_MAPPING', table: 'mappings', timestamp: '2023-06-14 14:20:00' },
        { id: 4, user: 'billing2', action: 'EXPORT_DATA', table: 'exports', timestamp: '2023-06-14 11:45:00' }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id))
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'audit'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Management</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Add User
                </button>
              </div>
              
              {loading ? (
                <p>Loading users...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'audit' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Audit Logs</h2>
                <div>
                  <input
                    type="text"
                    placeholder="Filter logs..."
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              {loading ? (
                <p>Loading audit logs...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.user}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.action}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.table}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">System Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-3">Database</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Connection Status:</span>
                      <span className="text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Studies Count:</span>
                      <span>1,245</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clients Count:</span>
                      <span>42</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-3">Application</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <span>1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Restart:</span>
                      <span>2023-06-15 08:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
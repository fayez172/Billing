import React, { useState, useEffect } from 'react'

const MasterConfiguration = () => {
  const [activeTab, setActiveTab] = useState('mappings')
  const [mappings, setMappings] = useState([])
  const [clients, setClients] = useState([])
  const [radiologists, setRadiologists] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      setMappings([
        { id: 1, modality: 'CT', procedure_pattern: 'Head', type: 'CT_HEAD', typedr: 'CT_HEAD_RAD', priority: 1 },
        { id: 2, modality: 'MRI', procedure_pattern: 'Spine', type: 'MRI_SPINE', typedr: 'MRI_SPINE_RAD', priority: 2 },
        { id: 3, modality: 'XRAY', procedure_pattern: 'Chest', type: 'XRAY_CHEST', typedr: 'XRAY_CHEST_RAD', priority: 1 }
      ])
      
      setClients([
        { id: 1, name: 'City Hospital', external_serial: 'CH001', billing_terms: 30, active: true },
        { id: 2, name: 'General Hospital', external_serial: 'GH002', billing_terms: 45, active: true }
      ])
      
      setRadiologists([
        { id: 1, name: 'Dr. Smith', email: 'smith@radiology.com', active: true },
        { id: 2, name: 'Dr. Johnson', email: 'johnson@radiology.com', active: true }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  const handleDeleteMapping = (id) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      setMappings(mappings.filter(mapping => mapping.id !== id))
    }
  }

  const handleDeleteClient = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== id))
    }
  }

  const handleDeleteRadiologist = (id) => {
    if (window.confirm('Are you sure you want to delete this radiologist?')) {
      setRadiologists(radiologists.filter(radiologist => radiologist.id !== id))
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Master Configuration</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('mappings')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'mappings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mappings
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'clients'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clients
            </button>
            <button
              onClick={() => setActiveTab('radiologists')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'radiologists'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Radiologists
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'mappings' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Procedure Mappings</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Add Mapping
                </button>
              </div>
              
              {loading ? (
                <p>Loading mappings...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modality</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedure Pattern</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TypeDR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mappings.map((mapping) => (
                        <tr key={mapping.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mapping.modality}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mapping.procedure_pattern}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mapping.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mapping.typedr}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mapping.priority}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                            <button 
                              onClick={() => handleDeleteMapping(mapping.id)}
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
          
          {activeTab === 'clients' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Clients</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Add Client
                </button>
              </div>
              
              {loading ? (
                <p>Loading clients...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">External Serial</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Terms</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clients.map((client) => (
                        <tr key={client.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.external_serial}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.billing_terms} days</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              client.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {client.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                            <button 
                              onClick={() => handleDeleteClient(client.id)}
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
          
          {activeTab === 'radiologists' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Radiologists</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Add Radiologist
                </button>
              </div>
              
              {loading ? (
                <p>Loading radiologists...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {radiologists.map((radiologist) => (
                        <tr key={radiologist.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{radiologist.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{radiologist.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              radiologist.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {radiologist.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                            <button 
                              onClick={() => handleDeleteRadiologist(radiologist.id)}
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
        </div>
      </div>
    </div>
  )
}

export default MasterConfiguration
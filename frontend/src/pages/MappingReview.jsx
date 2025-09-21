import React, { useState, useEffect } from 'react'

const MappingReview = () => {
  const [studies, setStudies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStudy, setSelectedStudy] = useState(null)
  const [newMapping, setNewMapping] = useState({
    modality: '',
    procedure_pattern: '',
    type: '',
    typedr: '',
    priority: 0
  })

  // Simulate fetching unmapped studies
  useEffect(() => {
    setTimeout(() => {
      setStudies([
        {
          id: 1,
          workflow_id: 'WRK001',
          procedure_raw: 'CT Head with Contrast',
          modality: 'CT',
          hospital_name: 'City Hospital',
          report_comp_time: '2023-06-15 10:30:00'
        },
        {
          id: 2,
          workflow_id: 'WRK002',
          procedure_raw: 'MRI Lumbar Spine',
          modality: 'MRI',
          hospital_name: 'General Hospital',
          report_comp_time: '2023-06-15 11:45:00'
        },
        {
          id: 3,
          workflow_id: 'WRK003',
          procedure_raw: 'X-Ray Chest PA View',
          modality: 'XRAY',
          hospital_name: 'District Hospital',
          report_comp_time: '2023-06-15 12:15:00'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleAssignMapping = (studyId, mapping) => {
    // In a real implementation, this would call the backend API
    setStudies(studies.filter(study => study.id !== studyId))
    alert(`Mapping assigned to study ${studyId}`)
  }

  const handleCreateMapping = () => {
    // In a real implementation, this would call the backend API
    alert('New mapping created')
    setSelectedStudy(null)
  }

  const openCreateMapping = (study) => {
    setSelectedStudy(study)
    setNewMapping({
      modality: study.modality,
      procedure_pattern: study.procedure_raw,
      type: '',
      typedr: '',
      priority: 0
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mapping Review Queue</h1>
      
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Loading studies...</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Unmapped Studies ({studies.length})</h2>
          
          {studies.length === 0 ? (
            <p className="text-gray-500">No unmapped studies found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studies.map((study) => (
                    <tr key={study.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{study.workflow_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.procedure_raw}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.modality}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.hospital_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(study.report_comp_time).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openCreateMapping(study)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Create Mapping
                        </button>
                        <button
                          onClick={() => handleAssignMapping(study.id, {})}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Ignore
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
      
      {selectedStudy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Create New Mapping</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Modality</label>
                  <input
                    type="text"
                    value={newMapping.modality}
                    onChange={(e) => setNewMapping({...newMapping, modality: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Procedure Pattern</label>
                  <input
                    type="text"
                    value={newMapping.procedure_pattern}
                    onChange={(e) => setNewMapping({...newMapping, procedure_pattern: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                  <input
                    type="text"
                    value={newMapping.type}
                    onChange={(e) => setNewMapping({...newMapping, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">TypeDR</label>
                  <input
                    type="text"
                    value={newMapping.typedr}
                    onChange={(e) => setNewMapping({...newMapping, typedr: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
                  <input
                    type="number"
                    value={newMapping.priority}
                    onChange={(e) => setNewMapping({...newMapping, priority: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedStudy(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateMapping}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Mapping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MappingReview
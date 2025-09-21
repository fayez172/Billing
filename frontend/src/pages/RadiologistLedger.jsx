import React, { useState, useEffect } from 'react'

const RadiologistLedger = () => {
  const [radiologists, setRadiologists] = useState([])
  const [selectedRadiologist, setSelectedRadiologist] = useState('')
  const [period, setPeriod] = useState({ start: '', end: '' })
  const [studies, setStudies] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalFee, setTotalFee] = useState(0)

  // Simulate fetching radiologists
  useEffect(() => {
    setTimeout(() => {
      setRadiologists([
        { id: 1, name: 'Dr. Smith' },
        { id: 2, name: 'Dr. Johnson' },
        { id: 3, name: 'Dr. Williams' }
      ])
    }, 500)
  }, [])

  const handleSearch = () => {
    if (!selectedRadiologist || !period.start || !period.end) {
      alert('Please select a radiologist and date range')
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const sampleStudies = [
        { id: 1, workflow_id: 'WRK001', procedure: 'CT Head', date: '2023-06-15', typedr: 'CT_HEAD_RAD', fee: 1200 },
        { id: 2, workflow_id: 'WRK005', procedure: 'CT Head', date: '2023-06-16', typedr: 'CT_HEAD_RAD', fee: 1200 },
        { id: 3, workflow_id: 'WRK012', procedure: 'MRI Spine', date: '2023-06-17', typedr: 'MRI_SPINE_RAD', fee: 2500 },
        { id: 4, workflow_id: 'WRK018', procedure: 'CT Head', date: '2023-06-18', typedr: 'CT_HEAD_RAD', fee: 1200 },
        { id: 5, workflow_id: 'WRK025', procedure: 'MRI Spine', date: '2023-06-19', typedr: 'MRI_SPINE_RAD', fee: 2500 }
      ]
      
      setStudies(sampleStudies)
      setTotalFee(sampleStudies.reduce((sum, study) => sum + study.fee, 0))
      setLoading(false)
    }, 1000)
  }

  const handleExport = (format) => {
    alert(`Exported ${selectedRadiologist}'s ledger as ${format.toUpperCase()}`)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Radiologist Ledger</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Radiologist</label>
            <select
              value={selectedRadiologist}
              onChange={(e) => setSelectedRadiologist(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a radiologist</option>
              {radiologists.map(radiologist => (
                <option key={radiologist.id} value={radiologist.id}>{radiologist.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Period Start</label>
            <input
              type="date"
              value={period.start}
              onChange={(e) => setPeriod({...period, start: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Period End</label>
            <input
              type="date"
              value={period.end}
              onChange={(e) => setPeriod({...period, end: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>
      
      {studies.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Studies for {radiologists.find(r => r.id == selectedRadiologist)?.name}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Export Excel
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TypeDR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee (৳)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studies.map((study) => (
                  <tr key={study.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{study.workflow_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.procedure}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.typedr}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{study.fee.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end">
            <div className="bg-gray-50 p-4 rounded w-64">
              <div className="flex justify-between font-bold">
                <span>Total Fee:</span>
                <span>৳{totalFee.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RadiologistLedger
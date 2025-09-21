import React, { useState } from 'react'

const ExportPage = () => {
  const [exportType, setExportType] = useState('client')
  const [columns, setColumns] = useState([])
  const [filters, setFilters] = useState({})
  const [exporting, setExporting] = useState(false)

  const allColumns = [
    'Workflow ID', 'MRN', 'Procedure', 'Report Comp Time', 'Final Rad', 
    'Modality', 'Hospital', 'Image Count', 'Patient', 'Type', 'TypeDR', 
    'Price', 'Radiologist Fee'
  ]

  const handleColumnChange = (column) => {
    if (columns.includes(column)) {
      setColumns(columns.filter(col => col !== column))
    } else {
      setColumns([...columns, column])
    }
  }

  const handleExport = (format) => {
    setExporting(true)
    
    // Simulate export process
    setTimeout(() => {
      alert(`Exported as ${format.toUpperCase()} successfully!`)
      setExporting(false)
    }, 1500)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Export Data</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Export Type</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exportType"
                  checked={exportType === 'client'}
                  onChange={() => setExportType('client')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3">Client Report</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exportType"
                  checked={exportType === 'radiologist'}
                  onChange={() => setExportType('radiologist')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3">Radiologist Report</span>
              </label>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="To"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Hospital</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">All Hospitals</option>
                  <option value="city">City Hospital</option>
                  <option value="general">General Hospital</option>
                  <option value="district">District Hospital</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Columns</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allColumns.map((column) => (
            <label key={column} className="flex items-center">
              <input
                type="checkbox"
                checked={columns.includes(column)}
                onChange={() => handleColumnChange(column)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-gray-700">{column}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Export Options</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className={`px-6 py-3 rounded-md font-medium ${
              exporting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {exporting ? 'Exporting...' : 'Export as CSV'}
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={exporting}
            className={`px-6 py-3 rounded-md font-medium ${
              exporting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {exporting ? 'Exporting...' : 'Export as Excel'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className={`px-6 py-3 rounded-md font-medium ${
              exporting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {exporting ? 'Exporting...' : 'Export as PDF'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportPage
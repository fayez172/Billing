import React, { useState } from 'react'

const UploadPage = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload')
      return
    }

    setUploading(true)
    
    // In a real implementation, this would call the backend API
    // For now, we'll simulate the response
    setTimeout(() => {
      setUploadResult({
        total: 150,
        parsed: 148,
        saved: 145,
        mapped: 120,
        fuzzy: 15,
        unmapped: 10,
        errors: []
      })
      setUploading(false)
    }, 1500)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Upload Studies</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Select Excel/CSV File
          </label>
          <input
            type="file"
            id="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            uploading || !file 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
      
      {uploadResult && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded">
              <p className="text-gray-500">Total Rows</p>
              <p className="text-2xl font-bold">{uploadResult.total}</p>
            </div>
            <div className="border p-4 rounded">
              <p className="text-gray-500">Parsed</p>
              <p className="text-2xl font-bold text-green-600">{uploadResult.parsed}</p>
            </div>
            <div className="border p-4 rounded">
              <p className="text-gray-500">Saved</p>
              <p className="text-2xl font-bold text-blue-600">{uploadResult.saved}</p>
            </div>
            <div className="border p-4 rounded">
              <p className="text-gray-500">Mapped</p>
              <p className="text-2xl font-bold text-green-600">{uploadResult.mapped}</p>
            </div>
            <div className="border p-4 rounded">
              <p className="text-gray-500">Fuzzy Matches</p>
              <p className="text-2xl font-bold text-yellow-600">{uploadResult.fuzzy}</p>
            </div>
            <div className="border p-4 rounded">
              <p className="text-gray-500">Unmapped</p>
              <p className="text-2xl font-bold text-red-600">{uploadResult.unmapped}</p>
            </div>
          </div>
          
          {uploadResult.errors.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Errors</h3>
              <ul className="list-disc pl-5 text-red-600">
                {uploadResult.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UploadPage
import React, { useState } from 'react';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Clear previous results when new file is selected
    setUploadResult(null);
    setPreviewData(null);
  };

  const handlePreview = async () => {
    if (!file) {
      alert('Please select a file to preview');
      return;
    }

    setPreviewLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/preview', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setPreviewData(result);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setUploadResult(result);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

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
        
        <div className="flex space-x-3">
          <button
            onClick={handlePreview}
            disabled={previewLoading || !file}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              previewLoading || !file 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {previewLoading ? 'Generating Preview...' : 'Preview File'}
          </button>
          
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
      </div>
      
      {previewData && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">File Preview</h2>
          <p className="mb-2">Total rows: {previewData.totalRows}</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {previewData.data.length > 0 && Object.keys(previewData.data[0]).map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {uploadResult && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
          
          {uploadResult.data && uploadResult.data.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Preview of Processed Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modality</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TypeDR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mapping Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadResult.data.map((study, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{study.workflow_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.procedure_raw}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.modality}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.hospital_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.type || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.typedr || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            study.mapping_confidence === 'exact' ? 'bg-green-100 text-green-800' :
                            study.mapping_confidence === 'fuzzy' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {study.mapping_confidence}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
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
  );
};

export default UploadPage;
import React, { useState, useEffect } from 'react'

const InvoiceBuilder = () => {
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [period, setPeriod] = useState({ start: '', end: '' })
  const [lineItems, setLineItems] = useState([])
  const [invoice, setInvoice] = useState({
    subtotal: 0,
    previous_due: 0,
    total_due: 0
  })
  const [loading, setLoading] = useState(false)

  // Simulate fetching clients
  useEffect(() => {
    setTimeout(() => {
      setClients([
        { id: 1, name: 'City Hospital' },
        { id: 2, name: 'General Hospital' },
        { id: 3, name: 'District Hospital' }
      ])
    }, 500)
  }, [])

  const handleGenerateLines = () => {
    if (!selectedClient || !period.start || !period.end) {
      alert('Please select a client and date range')
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const sampleLines = [
        { id: 1, type: 'CT_HEAD', qty: 15, price: 1200, total: 18000 },
        { id: 2, type: 'MRI_SPINE', qty: 8, price: 2500, total: 20000 },
        { id: 3, type: 'XRAY_CHEST', qty: 22, price: 500, total: 11000 }
      ]
      
      setLineItems(sampleLines)
      
      const subtotal = sampleLines.reduce((sum, item) => sum + item.total, 0)
      const totalDue = subtotal + invoice.previous_due
      
      setInvoice({
        subtotal,
        previous_due: invoice.previous_due,
        total_due: totalDue
      })
      
      setLoading(false)
    }, 1000)
  }

  const handleQtyChange = (id, qty) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          qty: parseInt(qty),
          total: parseInt(qty) * item.price
        }
        return updatedItem
      }
      return item
    }))
    
    // Recalculate totals
    const subtotal = lineItems.reduce((sum, item) => {
      if (item.id === id) {
        return sum + (parseInt(qty) * item.price)
      }
      return sum + item.total
    }, 0)
    
    const totalDue = subtotal + invoice.previous_due
    
    setInvoice({
      subtotal,
      previous_due: invoice.previous_due,
      total_due: totalDue
    })
  }

  const handlePriceChange = (id, price) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          price: parseFloat(price),
          total: item.qty * parseFloat(price)
        }
        return updatedItem
      }
      return item
    }))
    
    // Recalculate totals
    const subtotal = lineItems.reduce((sum, item) => {
      if (item.id === id) {
        return sum + (item.qty * parseFloat(price))
      }
      return sum + item.total
    }, 0)
    
    const totalDue = subtotal + invoice.previous_due
    
    setInvoice({
      subtotal,
      previous_due: invoice.previous_due,
      total_due: totalDue
    })
  }

  const handleSaveDraft = () => {
    alert('Invoice saved as draft')
  }

  const handleFinalize = () => {
    if (window.confirm('Are you sure you want to finalize this invoice?')) {
      alert('Invoice finalized')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Invoice Builder</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Client</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
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
              onClick={handleGenerateLines}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Lines'}
            </button>
          </div>
        </div>
      </div>
      
      {lineItems.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Invoice Line Items</h2>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (৳)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (৳)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        min="0"
                        value={item.qty}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div></div>
            <div></div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>৳{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Previous Due:</span>
                <span>
                  <input
                    type="number"
                    step="0.01"
                    value={invoice.previous_due}
                    onChange={(e) => {
                      const previousDue = parseFloat(e.target.value) || 0
                      const totalDue = invoice.subtotal + previousDue
                      setInvoice({
                        ...invoice,
                        previous_due: previousDue,
                        total_due: totalDue
                      })
                    }}
                    className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                  />
                </span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
                <span>Total Due:</span>
                <span>৳{invoice.total_due.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Save Draft
            </button>
            <button
              onClick={handleFinalize}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Finalize Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceBuilder
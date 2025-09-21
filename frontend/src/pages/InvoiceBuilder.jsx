import React, { useState, useEffect } from 'react';

const InvoiceBuilder = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [period, setPeriod] = useState({ start: '', end: '' });
  const [lineItems, setLineItems] = useState([]);
  const [invoice, setInvoice] = useState({
    subtotal: 0,
    previous_due: 0,
    total_due: 0
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Fetch clients from backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        // Fallback to sample data
        const sampleClients = [
          { id: 1, name: 'Lab Aid Dinajpur' },
          { id: 2, name: 'Lions Eye hospital and institute,Agargoan' },
          { id: 3, name: 'Jahan Medical Center, Noakhal' },
          { id: 4, name: 'Prottasha Diagnostic Centre ,Corpara Mymensin' }
        ];
        setClients(sampleClients);
      }
    };
    
    fetchClients();
  }, []);

  const handleGenerateLines = async () => {
    if (!selectedClient || !period.start || !period.end) {
      alert('Please select a client and date range');
      return;
    }

    setGenerating(true);
    
    try {
      // Call backend API to generate invoice lines
      const response = await fetch('/api/invoices/generate-lines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: selectedClient,
          period_start: period.start,
          period_end: period.end
        })
      });
      
      if (response.ok) {
        const lineItemsData = await response.json();
        
        // Fetch prices for each line item
        const pricedLineItems = await Promise.all(lineItemsData.map(async (item, index) => {
          // In a real implementation, this would fetch actual prices from the backend
          // For now, we'll use sample pricing data
          const samplePrices = {
            'X-Ray Single View': 30,
            'X-Ray Both View': 60,
            'Contrast X-Ray': 100,
            'Bone Age': 100,
            'CT Scan Brain': 300,
            'CT Scan Chest( 4),  Neck ,Joint & others (4)': 500,
            'CT Scan KUB': 800,
            'MRI Brain/Lumbar/Cervical/Dorsal spine': 500,
            'MRI Brain/spine with Screening others part': 500,
            'MRI Pelvis / Upper Abdomen /Extremities': 500,
            'MRI of Whole Abdomen/KUB': 500
          };
          
          const price = samplePrices[item.type] || 0;
          const total = item.qty * price;
          
          return {
            id: index + 1,
            type: item.type,
            qty: item.qty,
            price: price,
            total: total
          };
        }));
        
        setLineItems(pricedLineItems);
        
        const subtotal = pricedLineItems.reduce((sum, item) => sum + item.total, 0);
        const totalDue = subtotal + invoice.previous_due;
        
        setInvoice({
          subtotal,
          previous_due: invoice.previous_due,
          total_due: totalDue
        });
      } else {
        const error = await response.json();
        alert(`Error generating invoice: ${error.error}`);
      }
    } catch (error) {
      alert(`Error generating invoice: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleQtyChange = (id, qty) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          qty: parseInt(qty),
          total: parseInt(qty) * item.price
        };
        return updatedItem;
      }
      return item;
    }));
    
    // Recalculate totals
    const subtotal = lineItems.reduce((sum, item) => {
      if (item.id === id) {
        return sum + (parseInt(qty) * item.price);
      }
      return sum + item.total;
    }, 0);
    
    const totalDue = subtotal + invoice.previous_due;
    
    setInvoice({
      subtotal,
      previous_due: invoice.previous_due,
      total_due: totalDue
    });
  };

  const handlePriceChange = (id, price) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          price: parseFloat(price),
          total: item.qty * parseFloat(price)
        };
        return updatedItem;
      }
      return item;
    }));
    
    // Recalculate totals
    const subtotal = lineItems.reduce((sum, item) => {
      if (item.id === id) {
        return sum + (item.qty * parseFloat(price));
      }
      return sum + item.total;
    }, 0);
    
    const totalDue = subtotal + invoice.previous_due;
    
    setInvoice({
      subtotal,
      previous_due: invoice.previous_due,
      total_due: totalDue
    });
  };

  const copyTableToClipboard = () => {
    // Create HTML table
    let htmlTable = '<table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif;">';
    htmlTable += '<thead><tr style="background-color: #f3f4f6;">';
    htmlTable += '<th style="padding: 8px; text-align: left;">ID</th>';
    htmlTable += '<th style="padding: 8px; text-align: left;">Type</th>';
    htmlTable += '<th style="padding: 8px; text-align: left;">Qty</th>';
    htmlTable += '<th style="padding: 8px; text-align: left;">Price</th>';
    htmlTable += '<th style="padding: 8px; text-align: left;">Total</th>';
    htmlTable += '</tr></thead><tbody>';
    
    lineItems.forEach(item => {
      htmlTable += '<tr>';
      htmlTable += `<td style="padding: 8px;">${item.id}</td>`;
      htmlTable += `<td style="padding: 8px;">${item.type}</td>`;
      htmlTable += `<td style="padding: 8px;">${item.qty}</td>`;
      htmlTable += `<td style="padding: 8px;">${item.price}</td>`;
      htmlTable += `<td style="padding: 8px;">${item.total}</td>`;
      htmlTable += '</tr>';
    });
    
    // Add subtotal, previous due, and total due rows
    htmlTable += '<tr style="background-color: #f9fafb;">';
    htmlTable += '<td style="padding: 8px;" colspan="4"><strong>Subtotal</strong></td>';
    htmlTable += `<td style="padding: 8px;"><strong>${invoice.subtotal}</strong></td>`;
    htmlTable += '</tr>';
    
    htmlTable += '<tr style="background-color: #f9fafb;">';
    htmlTable += '<td style="padding: 8px;" colspan="4"><strong>Previous Due</strong></td>';
    htmlTable += `<td style="padding: 8px;"><strong>${invoice.previous_due}</strong></td>`;
    htmlTable += '</tr>';
    
    htmlTable += '<tr style="background-color: #f9fafb;">';
    htmlTable += '<td style="padding: 8px;" colspan="4"><strong>Total Due</strong></td>';
    htmlTable += `<td style="padding: 8px;"><strong>${invoice.total_due}</strong></td>`;
    htmlTable += '</tr>';
    
    htmlTable += '</tbody></table>';
    
    // Copy to clipboard
    navigator.clipboard.writeText(htmlTable).then(() => {
      alert('Invoice table copied to clipboard!');
    }).catch(err => {
      alert('Failed to copy table: ' + err);
    });
  };

  const copyTableAsCSV = () => {
    // Create CSV content
    let csvContent = 'ID,Type,Qty,Price,Total\n';
    
    lineItems.forEach(item => {
      csvContent += `${item.id},"${item.type}",${item.qty},${item.price},${item.total}\n`;
    });
    
    // Add subtotal, previous due, and total due rows
    csvContent += `,,,"Subtotal",${invoice.subtotal}\n`;
    csvContent += `,,,"Previous Due",${invoice.previous_due}\n`;
    csvContent += `,,,"Total Due",${invoice.total_due}\n`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(csvContent).then(() => {
      alert('Invoice table copied to clipboard as CSV!');
    }).catch(err => {
      alert('Failed to copy table: ' + err);
    });
  };

  const printInvoice = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .totals { margin-top: 20px; }
          .totals-row { display: flex; justify-content: flex-end; }
          .totals-table { width: 300px; }
          .totals-table td { border: 1px solid #ddd; padding: 8px; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>
        <p><strong>Client:</strong> ${clients.find(c => c.id == selectedClient)?.name || 'N/A'}</p>
        <p><strong>Period:</strong> ${period.start} to ${period.end}</p>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price (৳)</th>
              <th>Total (৳)</th>
            </tr>
          </thead>
          <tbody>
            ${lineItems.map(item => `
              <tr>
                <td>${item.id}</td>
                <td>${item.type}</td>
                <td>${item.qty}</td>
                <td>${item.price}</td>
                <td>${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <table class="totals-table">
            <tr>
              <td class="text-right">Subtotal:</td>
              <td class="text-right">${invoice.subtotal}</td>
            </tr>
            <tr>
              <td class="text-right">Previous Due:</td>
              <td class="text-right">${invoice.previous_due}</td>
            </tr>
            <tr>
              <td class="text-right font-bold">Total Due:</td>
              <td class="text-right font-bold">${invoice.total_due}</td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const exportAsExcel = () => {
    // In a real implementation, this would generate an actual Excel file
    alert('Excel export functionality would be implemented here.');
  };

  const exportAsPDF = () => {
    // In a real implementation, this would generate an actual PDF file
    alert('PDF export functionality would be implemented here.');
  };

  const handleSaveDraft = () => {
    alert('Invoice saved as draft');
  };

  const handleFinalize = () => {
    if (window.confirm('Are you sure you want to finalize this invoice?')) {
      alert('Invoice finalized');
    }
  };

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
              disabled={generating}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                generating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {generating ? 'Generating...' : 'Generate Lines'}
            </button>
          </div>
        </div>
      </div>
      
      {lineItems.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Invoice Line Items</h2>
            <div className="flex space-x-2">
              <button
                onClick={copyTableToClipboard}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Copy Table
              </button>
              <button
                onClick={copyTableAsCSV}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Copy as CSV
              </button>
              <button
                onClick={printInvoice}
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
              >
                Print Invoice
              </button>
              <button
                onClick={exportAsExcel}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Export Excel
              </button>
              <button
                onClick={exportAsPDF}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Export PDF
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (৳)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (৳)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
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
                      const previousDue = parseFloat(e.target.value) || 0;
                      const totalDue = invoice.subtotal + previousDue;
                      setInvoice({
                        ...invoice,
                        previous_due: previousDue,
                        total_due: totalDue
                      });
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
  );
};

export default InvoiceBuilder;
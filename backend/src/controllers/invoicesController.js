import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import Study from '../models/Study.js';

const invoicesController = {
  // Create a new invoice
  create: async (req, res) => {
    try {
      const { client_id, period_start, period_end, lines } = req.body;
      
      // Validate client exists
      const client = await Client.findById(client_id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      // Calculate totals
      let subtotal = 0;
      for (const line of lines) {
        subtotal += line.total;
      }
      
      // Create invoice
      const invoiceData = {
        ...req.body,
        subtotal,
        total_due: subtotal + (req.body.previous_due || 0),
        status: 'draft',
        created_by: req.user.id // Assuming user is attached to request
      };
      
      const invoice = await Invoice.create(invoiceData);
      
      // Add line items
      if (lines && lines.length > 0) {
        await Invoice.addLineItems(invoice.id, lines);
      }
      
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get invoice by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findById(id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      
      // Get line items
      const lineItems = await Invoice.getLineItems(id);
      
      res.json({
        ...invoice,
        lines: lineItems
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all invoices for a client
  getByClient: async (req, res) => {
    try {
      const { clientId } = req.params;
      
      // Validate client exists
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      const invoices = await Invoice.findAllByClient(clientId);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update invoice status
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const invoice = await Invoice.updateStatus(id, status);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Generate invoice line items automatically
  generateLines: async (req, res) => {
    try {
      const { client_id, period_start, period_end } = req.body;
      
      // Get studies for this client and period
      const client = await Client.findById(client_id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      const studies = await Study.findAllWithFilters({
        hospital: client.name,
        dateFrom: period_start,
        dateTo: period_end
      });
      
      // Group by type and calculate quantities
      const groupedStudies = {};
      for (const study of studies) {
        if (study.type) {
          if (!groupedStudies[study.type]) {
            groupedStudies[study.type] = {
              type: study.type,
              qty: 0
            };
          }
          groupedStudies[study.type].qty++;
        }
      }
      
      // Convert to array and add pricing
      const lineItems = await Promise.all(Object.values(groupedStudies).map(async (item, index) => {
        // Get price for this type and client
        const price = await Client.getPriceForType(client_id, item.type, new Date());
        
        return {
          id: index + 1,
          type: item.type,
          qty: item.qty,
          price: price || 0,
          total: (price || 0) * item.qty
        };
      }));
      
      res.json(lineItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default invoicesController;
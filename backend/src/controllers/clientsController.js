import Client from '../models/Client.js';
import ClientPrice from '../models/ClientPrice.js';

const clientsController = {
  // Get all clients
  getAll: async (req, res) => {
    try {
      const clients = await Client.findAll();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get client by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await Client.findById(id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a new client
  create: async (req, res) => {
    try {
      const client = await Client.create(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a client
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await Client.update(id, req.body);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get client prices
  getPrices: async (req, res) => {
    try {
      const { id } = req.params;
      const { date } = req.query;
      
      // Check if client exists
      const client = await Client.findById(id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      // Get all prices for this client
      const prices = await ClientPrice.findByClientId(id);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add client price
  addPrice: async (req, res) => {
    try {
      const { id } = req.params;
      const priceData = { ...req.body, client_id: id };
      
      // Check if client exists
      const client = await Client.findById(id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      const price = await ClientPrice.create(priceData);
      res.status(201).json(price);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update client price
  updatePrice: async (req, res) => {
    try {
      const { priceId } = req.params;
      const price = await ClientPrice.update(priceId, req.body);
      if (!price) {
        return res.status(404).json({ error: 'Price not found' });
      }
      res.json(price);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Bulk import client prices from CSV data
  importPrices: async (req, res) => {
    try {
      const { id } = req.params;
      const { prices } = req.body;
      
      // Check if client exists
      const client = await Client.findById(id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      // Import prices
      const importedPrices = await Client.bulkImportPrices(id, prices);
      
      res.json({
        message: 'Prices imported successfully',
        count: importedPrices.length,
        prices: importedPrices
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default clientsController;
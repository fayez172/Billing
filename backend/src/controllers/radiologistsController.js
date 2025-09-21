import Radiologist from '../models/Radiologist.js';
import RadiologistPrice from '../models/RadiologistPrice.js';

const radiologistsController = {
  // Get all radiologists
  getAll: async (req, res) => {
    try {
      const radiologists = await Radiologist.findAll();
      res.json(radiologists);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get radiologist by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const radiologist = await Radiologist.findById(id);
      if (!radiologist) {
        return res.status(404).json({ error: 'Radiologist not found' });
      }
      res.json(radiologist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a new radiologist
  create: async (req, res) => {
    try {
      const radiologist = await Radiologist.create(req.body);
      res.status(201).json(radiologist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a radiologist
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const radiologist = await Radiologist.update(id, req.body);
      if (!radiologist) {
        return res.status(404).json({ error: 'Radiologist not found' });
      }
      res.json(radiologist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get radiologist prices
  getPrices: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if radiologist exists
      const radiologist = await Radiologist.findById(id);
      if (!radiologist) {
        return res.status(404).json({ error: 'Radiologist not found' });
      }
      
      // Get all prices for this radiologist
      const prices = await RadiologistPrice.findByRadiologistId(id);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add radiologist price
  addPrice: async (req, res) => {
    try {
      const { id } = req.params;
      const priceData = { ...req.body, radiologist_id: id };
      
      // Check if radiologist exists
      const radiologist = await Radiologist.findById(id);
      if (!radiologist) {
        return res.status(404).json({ error: 'Radiologist not found' });
      }
      
      const price = await RadiologistPrice.create(priceData);
      res.status(201).json(price);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update radiologist price
  updatePrice: async (req, res) => {
    try {
      const { priceId } = req.params;
      const price = await RadiologistPrice.update(priceId, req.body);
      if (!price) {
        return res.status(404).json({ error: 'Price not found' });
      }
      res.json(price);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default radiologistsController;
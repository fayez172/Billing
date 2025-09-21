import Mapping from '../models/Mapping.js';

const mappingsController = {
  // Get all mappings
  getAll: async (req, res) => {
    try {
      const mappings = await Mapping.findAll();
      res.json(mappings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a new mapping
  create: async (req, res) => {
    try {
      const mapping = await Mapping.create(req.body);
      res.status(201).json(mapping);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a mapping
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const mapping = await Mapping.update(id, req.body);
      if (!mapping) {
        return res.status(404).json({ error: 'Mapping not found' });
      }
      res.json(mapping);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a mapping
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const mapping = await Mapping.delete(id);
      if (!mapping) {
        return res.status(404).json({ error: 'Mapping not found' });
      }
      res.json({ message: 'Mapping deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Resolve mappings for studies
  resolve: async (req, res) => {
    try {
      const { studies } = req.body;
      const results = [];

      for (const study of studies) {
        const { mapping, confidence } = await Mapping.findByModalityAndProcedure(
          study.modality,
          study.procedure_raw
        );

        if (mapping) {
          results.push({
            study_id: study.id,
            type: mapping.type,
            typedr: mapping.typedr,
            confidence
          });
        } else {
          results.push({
            study_id: study.id,
            type: null,
            typedr: null,
            confidence: 'manual'
          });
        }
      }

      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default mappingsController;
import express from 'express';
import uploadController from '../controllers/uploadController.js';
import mappingsController from '../controllers/mappingsController.js';
import clientsController from '../controllers/clientsController.js';
import radiologistsController from '../controllers/radiologistsController.js';
import invoicesController from '../controllers/invoicesController.js';
import exportsController from '../controllers/exportsController.js';

const router = express.Router();

// Upload routes
router.post('/upload', uploadController.upload, uploadController.processUpload);
router.post('/upload/preview', uploadController.upload, uploadController.getPreview);

// Mapping routes
router.get('/mappings', mappingsController.getAll);
router.post('/mappings', mappingsController.create);
router.put('/mappings/:id', mappingsController.update);
router.delete('/mappings/:id', mappingsController.delete);
router.post('/mappings/resolve', mappingsController.resolve);

// Client routes
router.get('/clients', clientsController.getAll);
router.get('/clients/:id', clientsController.getById);
router.post('/clients', clientsController.create);
router.put('/clients/:id', clientsController.update);
router.get('/clients/:id/prices', clientsController.getPrices);
router.post('/clients/:id/prices', clientsController.addPrice);
router.put('/clients/:id/prices/:priceId', clientsController.updatePrice);

// Radiologist routes
router.get('/radiologists', radiologistsController.getAll);
router.get('/radiologists/:id', radiologistsController.getById);
router.post('/radiologists', radiologistsController.create);
router.put('/radiologists/:id', radiologistsController.update);
router.get('/radiologists/:id/prices', radiologistsController.getPrices);
router.post('/radiologists/:id/prices', radiologistsController.addPrice);
router.put('/radiologists/:id/prices/:priceId', radiologistsController.updatePrice);

// Invoice routes
router.post('/invoices', invoicesController.create);
router.get('/invoices/:id', invoicesController.getById);
router.get('/invoices/client/:clientId', invoicesController.getByClient);
router.put('/invoices/:id/status', invoicesController.updateStatus);
router.post('/invoices/generate-lines', invoicesController.generateLines);

// Export routes
router.post('/export/csv', exportsController.exportCSV);
router.post('/export/excel', exportsController.exportExcel);
router.get('/invoices/:id/export/pdf', exportsController.exportInvoicePDF);

export default router;
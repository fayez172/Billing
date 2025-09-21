# Teleradiology Billing System

A comprehensive web application for managing teleradiology billing, replacing manual Excel-based workflows with an automated system.

## Features

- **Excel/CSV Upload**: Upload study data with automatic parsing and validation
- **Procedure Mapping**: Automatic mapping of procedures to billing categories
- **Pricing Lookup**: Real-time pricing based on client and radiologist contracts
- **Invoice Generation**: Automated invoice creation with line items and totals
- **Export Options**: Export invoices as CSV, Excel, or PDF
- **Print Functionality**: Direct printing of invoices from the browser
- **Copy to Clipboard**: Copy invoice tables as HTML or CSV for easy sharing

## Data Format

### Study Data Upload
The system expects Excel/CSV files with the following columns:
- **Workflow ID**: Unique ID in your database
- **MRN**: Hospital number from the respective client
- **Procedure**: Procedure name of the study
- **Report Comp Time**: Sign-off time
- **Final Rad**: Sign-off radiologist name
- **Modality**: Modality of the study (CT, MR, CR, etc.)
- **Hospital**: Name of Hospital/Diagnostic center
- **Image Count**: Number of images in the procedure
- **Patient**: Name of the patient

Example:
```
Workflow ID,MRN,Procedure,Report Comp Time,Final Rad,Modality,Hospital,Image Count,Patient
2568386,DN22749,BRAIN,19/2/24 18:42,Dr. Hamonto Roy Chowdhury,CT,Popular Diagnostic Center Rangpur,65,ROMESH ROY
```

### Procedure Mapping
The system uses a mapping table to convert procedures to billing types:
- **Modality**: Study modality (CT, MR, CR, etc.)
- **Procedure Pattern**: Pattern to match in procedure names
- **Type**: Client billing category
- **TypeDR**: Radiologist billing category

### Pricing Data
Client and radiologist pricing is stored in the database with:
- **Type/TypeDR**: Billing category
- **Price/Fee**: Amount in local currency (Taka)
- **Effective Dates**: Validity period for pricing

## Getting Started

1. **Upload Study Data**: Navigate to the Upload page and upload your Excel/CSV file
2. **Review Mappings**: Check the Mapping Review page to verify procedure mappings
3. **Generate Invoice**: Go to Invoice Builder, select a client and date range
4. **Customize**: Adjust quantities or prices as needed
5. **Export/Print**: Use the export buttons to copy, print, or save the invoice

## API Endpoints

### Upload
- `POST /api/upload` - Upload and process study data
- `POST /api/upload/preview` - Preview uploaded data

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients/:id/import-prices` - Import client pricing data

### Radiologists
- `GET /api/radiologists` - Get all radiologists
- `POST /api/radiologists/:id/import-fees` - Import radiologist fee data

### Invoices
- `POST /api/invoices/generate-lines` - Generate invoice line items
- `POST /api/invoices/:id/export/pdf` - Export invoice as PDF

## Sample Data

Sample data files are included in the `samples/` directory:
- `comprehensive_sample_data.csv` - Study data for testing
- `client_pricing_sample.csv` - Client pricing template
- `radiologist_pricing_sample.csv` - Radiologist fee template

## Production Deployment

1. Update database connection settings in `.env`
2. Set up client and radiologist pricing in the database
3. Configure proper authentication and authorization
4. Set up SSL certificates for secure communication
5. Monitor logs and set up alerts for errors

## Support

For issues or feature requests, please contact the development team.

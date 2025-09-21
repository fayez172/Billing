# Teleradiology Billing System

A web application for automating teleradiology billing processes, replacing manual Excel workflows with an automated system.

## Features

- **File Upload**: Import studies from Excel/CSV files
- **Automated Mapping**: Map procedures to billing categories using configurable rules
- **Pricing Management**: Configure client and radiologist pricing tables
- **Invoice Generation**: Automatically generate invoices with manual editing capabilities
- **Reporting**: Export reports in CSV, Excel, and PDF formats
- **Audit Trail**: Comprehensive logging of all system activities
- **User Management**: Role-based access control (Admin/Billing)

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL database
- SheetJS for Excel parsing
- JWT for authentication

### Frontend
- React with Vite
- Tailwind CSS for styling
- React Router for navigation

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── db/
│   │   └── index.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your database settings

4. Run database migrations (using the provided schema.sql)

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/upload` - Upload and process Excel/CSV files
- `GET /api/mappings` - Retrieve all mappings
- `POST /api/mappings` - Create a new mapping
- `GET /api/clients` - Retrieve all clients
- `POST /api/clients` - Create a new client
- `POST /api/invoices` - Create a new invoice
- And many more...

## Development

### Database Schema

The database schema is defined in `backend/src/db/schema.sql` and includes tables for:
- Studies
- Clients and client pricing
- Radiologists and radiologist pricing
- Mappings
- Invoices and invoice lines
- Audit logs

### Authentication

The system uses JWT tokens for authentication. Admin users have full access to all features, while billing users have access to core billing functionality.

## Deployment

For production deployment:
1. Build the frontend: `npm run build`
2. Set environment variables for production
3. Deploy backend and frontend to your preferred hosting platform
4. Configure reverse proxy (nginx, etc.) if needed

## Sample Data

The system includes templates for:
- Sample input CSV files
- Sample mappings
- Sample client and radiologist pricing data
- Sample invoice templates

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
-- Database schema for Teleradiology Billing System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'billing')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Studies table
CREATE TABLE studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id VARCHAR(100) UNIQUE,
    mrn VARCHAR(50),
    procedure_raw TEXT,
    report_comp_time TIMESTAMP,
    final_rad_name VARCHAR(100),
    modality VARCHAR(50),
    hospital_name VARCHAR(100),
    image_count INTEGER,
    patient_name VARCHAR(100),
    type VARCHAR(50),
    typedr VARCHAR(50),
    mapped_by UUID REFERENCES users(id),
    mapping_confidence VARCHAR(10) CHECK (mapping_confidence IN ('exact', 'fuzzy', 'manual')),
    parent_id UUID REFERENCES studies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients (hospitals) table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    external_serial VARCHAR(50),
    billing_terms INTEGER, -- net days
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client prices table
CREATE TABLE client_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) NOT NULL,
    type VARCHAR(50) NOT NULL,
    price_taka NUMERIC(10, 2) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Radiologists table
CREATE TABLE radiologists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Radiologist prices table
CREATE TABLE radiologist_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    radiologist_id UUID REFERENCES radiologists(id) NOT NULL,
    typedr VARCHAR(50) NOT NULL,
    fee NUMERIC(10, 2) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Master mappings table
CREATE TABLE mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    modality VARCHAR(50) NOT NULL,
    procedure_pattern VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    typedr VARCHAR(50) NOT NULL,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    previous_due NUMERIC(12, 2) DEFAULT 0,
    total_due NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'final', 'paid')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice lines table
CREATE TABLE invoice_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) NOT NULL,
    type VARCHAR(50) NOT NULL,
    qty INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exports table
CREATE TABLE exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    filename VARCHAR(255),
    export_type VARCHAR(50), -- client, radiologist
    format VARCHAR(10), -- csv, xlsx, pdf
    filters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_studies_workflow_id ON studies(workflow_id);
CREATE INDEX idx_studies_report_comp_time ON studies(report_comp_time);
CREATE INDEX idx_studies_hospital_name ON studies(hospital_name);
CREATE INDEX idx_studies_modality ON studies(modality);
CREATE INDEX idx_studies_type ON studies(type);
CREATE INDEX idx_client_prices_client_type ON client_prices(client_id, type);
CREATE INDEX idx_client_prices_effective_dates ON client_prices(effective_from, effective_to);
CREATE INDEX idx_radiologist_prices_rad_typedr ON radiologist_prices(radiologist_id, typedr);
CREATE INDEX idx_radiologist_prices_effective_dates ON radiologist_prices(effective_from, effective_to);
CREATE INDEX idx_mappings_modality_pattern ON mappings(modality, procedure_pattern);
CREATE INDEX idx_invoice_lines_invoice_id ON invoice_lines(invoice_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
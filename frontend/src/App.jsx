import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/UploadPage'
import MappingReview from './pages/MappingReview'
import MasterConfiguration from './pages/MasterConfiguration'
import InvoiceBuilder from './pages/InvoiceBuilder'
import ExportPage from './pages/ExportPage'
import RadiologistLedger from './pages/RadiologistLedger'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/mapping-review" element={<MappingReview />} />
            <Route path="/configuration" element={<MasterConfiguration />} />
            <Route path="/invoice-builder" element={<InvoiceBuilder />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="/radiologist-ledger" element={<RadiologistLedger />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
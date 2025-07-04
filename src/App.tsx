import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { NotificationContainer } from './components/notifications/NotificationContainer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Designs } from './pages/Designs';
import { Creators } from './pages/Creators';
import { CustomDesign } from './pages/CustomDesign';
import { CreateProduct } from './pages/CreateProduct';
import { About } from './pages/About';
import { CartPage } from './components/cart/CartPage';
import { CustomerDashboard } from './pages/dashboard/CustomerDashboard';
import { DesignerDashboard } from './pages/dashboard/DesignerDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/designs" element={<Designs />} />
                <Route path="/creators" element={<Creators />} />
                <Route path="/design" element={<CustomDesign />} />
                <Route path="/create" element={<CreateProduct />} />
                <Route path="/about" element={<About />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* Protected Dashboard Routes */}
                <Route 
                  path="/dashboard/customer" 
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/designer" 
                  element={
                    <ProtectedRoute requiredRole="designer">
                      <DesignerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/admin" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            <NotificationContainer />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
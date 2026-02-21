import React, { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import axios from 'axios'
import Home from './Home'
import Signup from './components/Signup'
import Login from './components/Login'
import ProductDisplay from './components/ProductDisplay'
import Admin from './components/Admin'
import AddProduct from './components/AddProducts'
import User from './components/User'
import Profile from './components/Profile'
import EditProduct from './components/EditProduct'
import AllProducts from './components/AllProducts'
import { SuccessPayment, CancelPayment } from './components/Success';
import AdminOrdersPage from './components/AdminOrdersPage'
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './components/Checkout'
import Analytics from './components/Analytics'
import WhatsAppButton from './components/WhatsappBtn'
import NotificationPopup from './components/Notification'
import AddNotification from './components/AddNotification'
import RandomOrder from './components/random/RandomOrder'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

/* Wrap public pages with the Prada Navbar + Footer */
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

const App = () => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const role = user?.role || null;
  const isUserLoggedIn = !!user && !!role;
  const [visitor, setVisitor] = useState(0)
  
  useEffect(() => {
    setVisitor((prevVisitor) => prevVisitor + 1);
  }, [])
  console.log(visitor)

  const updateVisitCount = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/updateGlobalVisitCount`,
      );
      console.log('Updated Visit Count:', response.data);
    } catch (error) {
      console.error('Error updating visit count:', error);
    }
  };
  
  useEffect(() => {
    updateVisitCount()
  }, [])

  return (
    <div className='overflow-hidden'>
      {/* Show these components only for non-admin users */}
      {role !== "admin" && (
        console.log("🔵 Non-admin user detected, showing RandomOrder and WhatsAppButton"),
        <>
          <RandomOrder />
          <WhatsAppButton />
          <NotificationPopup />
        </>
      )}

      <Routes>
        {/* Public routes with Navbar + Footer layout */}
        <Route path='/' element={<PublicLayout><Home isLayout={false} /></PublicLayout>} />
        <Route path='/signup' element={<PublicLayout><Signup /></PublicLayout>} />
        <Route path='/login' element={<PublicLayout><Login /></PublicLayout>} />
        <Route path='/product/:id' element={<PublicLayout><ProductDisplay /></PublicLayout>} />
        <Route path='/profile' element={<PublicLayout><Profile /></PublicLayout>} />
        <Route path='/all-products' element={<PublicLayout><AllProducts /></PublicLayout>} />
        <Route path="/products/:category" element={<PublicLayout><AllProducts /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
        <Route path="/payment/success" element={<PublicLayout><SuccessPayment /></PublicLayout>} />
        <Route path="/payment/cancel" element={<PublicLayout><CancelPayment /></PublicLayout>} />

        {/* Admin Routes (no Navbar/Footer layout) */}
        <Route path='/admin' element={<ProtectedRoute role={role} requiredRole="admin"><Admin /></ProtectedRoute>} />
        <Route path='/add-product' element={<ProtectedRoute role={role} requiredRole="admin"><AddProduct /></ProtectedRoute>} />
        <Route path='/add-users' element={<ProtectedRoute role={role} requiredRole="admin"><User /></ProtectedRoute>} />
        <Route path='/edit-product/:id' element={<ProtectedRoute role={role} requiredRole="admin"><EditProduct /></ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute role={role} requiredRole="admin"><AdminOrdersPage /></ProtectedRoute>} />
        <Route path='/analytics' element={<ProtectedRoute role={role} requiredRole="admin"><Analytics /></ProtectedRoute>} />
        <Route path='/notification' element={<ProtectedRoute role={role} requiredRole="admin"><AddNotification /></ProtectedRoute>} />
        
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { AddUser } from './pages/AddUser';
import { Events } from './pages/Events';
import { CreateEvent } from './pages/CreateEvent';
import { Societies } from './pages/Societies';
import { AddSociety } from './pages/AddSociety';
import { Vendors } from './pages/Vendors';
import { AddVendor } from './pages/AddVendor';
import { Exhibitors } from './pages/Exhibitors';
import { AddExhibitor } from './pages/AddExhibitor';
import { ProductsShowcase } from './pages/ProductsShowcase';
import { Calendar } from './pages/Calendar';
import { Billing } from './pages/Billing';
import { CreatePlan } from './pages/CreatePlan';
import { AdsSponsors } from './pages/AdsSponsors';
import { Settings } from './pages/Settings';
import { Reports } from './pages/Reports';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/users/add" element={
        <ProtectedRoute>
          <AddUser />
        </ProtectedRoute>
      } />
      <Route path="/events" element={
        <ProtectedRoute>
          <Events />
        </ProtectedRoute>
      } />
      <Route path="/events/create" element={
        <ProtectedRoute>
          <CreateEvent />
        </ProtectedRoute>
      } />
      <Route path="/societies" element={
        <ProtectedRoute>
          <Societies />
        </ProtectedRoute>
      } />
      <Route path="/societies/add" element={
        <ProtectedRoute>
          <AddSociety />
        </ProtectedRoute>
      } />
      <Route path="/vendors" element={
        <ProtectedRoute>
          <Vendors />
        </ProtectedRoute>
      } />
      <Route path="/vendors/add" element={
        <ProtectedRoute>
          <AddVendor />
        </ProtectedRoute>
      } />
      <Route path="/exhibitors" element={
        <ProtectedRoute>
          <Exhibitors />
        </ProtectedRoute>
      } />
      <Route path="/exhibitors/add" element={
        <ProtectedRoute>
          <AddExhibitor />
        </ProtectedRoute>
      } />
      <Route path="/exhibitors/products" element={
        <ProtectedRoute>
          <ProductsShowcase />
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute>
          <Billing />
        </ProtectedRoute>
      } />
      <Route path="/billing/plans/create" element={
        <ProtectedRoute>
          <CreatePlan />
        </ProtectedRoute>
      } />
      <Route path="/ads-sponsors" element={
        <ProtectedRoute>
          <AdsSponsors />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
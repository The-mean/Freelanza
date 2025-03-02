import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Public Pages
// These will be implemented later
const Home = () => <div className="p-8 text-center">Ana Sayfa - Yakında</div>;
const Jobs = () => <div className="p-8 text-center">İş İlanları - Yakında</div>;
const Freelancers = () => <div className="p-8 text-center">Freelancerlar - Yakında</div>;
const HowItWorks = () => <div className="p-8 text-center">Nasıl Çalışır - Yakında</div>;

// Protected Pages
// These will be implemented later
const Dashboard = () => <div className="p-8 text-center">Dashboard - Yakında</div>;
const Unauthorized = () => <div className="p-8 text-center">Yetkisiz Erişim</div>;

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout hideFooter>
                  <Login />
                </Layout>
              }
            />
            <Route
              path="/register"
              element={
                <Layout hideFooter>
                  <Register />
                </Layout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <Layout hideFooter>
                  <ForgotPassword />
                </Layout>
              }
            />
            <Route
              path="/reset-password"
              element={
                <Layout hideFooter>
                  <ResetPassword />
                </Layout>
              }
            />
            <Route
              path="/jobs"
              element={
                <Layout>
                  <Jobs />
                </Layout>
              }
            />
            <Route
              path="/freelancers"
              element={
                <Layout>
                  <Freelancers />
                </Layout>
              }
            />
            <Route
              path="/how-it-works"
              element={
                <Layout>
                  <HowItWorks />
                </Layout>
              }
            />
            <Route
              path="/unauthorized"
              element={
                <Layout>
                  <Unauthorized />
                </Layout>
              }
            />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;

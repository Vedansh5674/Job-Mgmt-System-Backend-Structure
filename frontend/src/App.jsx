import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useStore from './store/useStore';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import DashboardLayout from './components/layouts/DashboardLayout';
import WebSocketManager from './components/WebSocketManager';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy loading components for performance
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const JobListings = lazy(() => import('./pages/JobListings'));
const MyApplications = lazy(() => import('./pages/MyApplications'));
const PostJob = lazy(() => import('./pages/PostJob'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Candidates = lazy(() => import('./pages/Candidates'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Wrapper to handle layout switching
const AppContent = () => {
  const { theme } = useStore();
  const location = useLocation();
  
  // Define which paths should use the DashboardLayout
  const dashboardPaths = ['/dashboard', '/applications', '/post-job', '/candidates'];
  const isDashboardPath = dashboardPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className={`${theme} min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      {!isDashboardPath && <Navbar />}
      <WebSocketManager />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
          <p className="text-slate-500 font-medium animate-pulse">Synchronizing dashboard...</p>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/jobs" element={<JobListings />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute role="seeker">
               <DashboardLayout>
                <MyApplications />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/post-job" element={
            <ProtectedRoute role="recruiter">
               <DashboardLayout>
                <PostJob />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/candidates" element={
            <ProtectedRoute role="recruiter">
               <DashboardLayout>
                <Candidates />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { EventDetails } from './pages/EventDetails';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { RequireAuth } from './components/RequireAuth';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { MyEvents } from './pages/MyEvents';
import Demo from './pages/Demo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/events/:id" element={<Layout><EventDetails /></Layout>} />
      <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
      <Route path="/my-events" element={<Layout><MyEvents /></Layout>} />
      <Route path="/demo" element={<Layout><Demo /></Layout>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <RequireAuth>
            <Layout>
              <AdminDashboard />
            </Layout>
          </RequireAuth>
        } 
      />
    </Routes>
  );
}

export default App;

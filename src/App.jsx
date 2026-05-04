// App.jsx
// Règle architecturale : chaque page gère sa propre navbar.
// App.jsx ne monte AUCUNE navbar globale — fini les doublons.

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/layout/Sidebar';
import Accueil from './pages/accueil';
import Login from './pages/Login';
import Signup from './pages/signup';
import Home from './pages/Home';
import WorkspacePage from './pages/WorkspacePage';
import TablePage from './pages/TablePage';
import NotFound from './pages/NotFound';

const PRIVATE_PREFIXES = ['/home', '/workspace', '/table'];

function AppLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isPrivate = PRIVATE_PREFIXES.some(p => location.pathname.startsWith(p));

  if (!isAuthenticated || !isPrivate) return children;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/"         element={<Accueil />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/workspace/:workspaceId" element={<PrivateRoute><WorkspacePage /></PrivateRoute>} />
          <Route path="/table/:id" element={<PrivateRoute><TablePage /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
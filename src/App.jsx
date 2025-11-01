import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Planes from './pages/Planes';
import PanelCliente from './pages/PanelCliente';
import PanelAbogado from './pages/PanelAbogado';
import PanelAdmin from './pages/PanelAdmin';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/planes" element={<Planes />} />
      <Route
        path="/panel-cliente"
        element={
          <PanelCliente />
        }
      />
      <Route
        path="/panel-abogado"
        element={
          <PanelAbogado />
        }
      />
      <Route
        path="/panel-admin"
        element={
          <PanelAdmin />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

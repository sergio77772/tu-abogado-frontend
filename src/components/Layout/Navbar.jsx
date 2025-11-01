import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.rol) {
      case 'cliente':
        return '/panel-cliente';
      case 'abogado':
        return '/panel-abogado';
      case 'admin':
        return '/panel-admin';
      default:
        return '/';
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Tu Abogado en Línea
        </Typography>
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={() => navigate(getDashboardPath())}>
              Panel
            </Button>
            <Button color="inherit" onClick={() => navigate('/planes')}>
              Planes
            </Button>
            <Typography variant="body2" sx={{ alignSelf: 'center', mr: 2 }}>
              {user.nombre}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Salir
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Registrarse
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

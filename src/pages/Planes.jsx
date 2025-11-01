import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CheckCircle, AttachMoney } from '@mui/icons-material';
import { planesService } from '../services/planesService';
import { comprasService } from '../services/comprasService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const Planes = () => {
  const { user, isAuthenticated } = useAuth();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comprando, setComprando] = useState(null);

  useEffect(() => {
    loadPlanes();
  }, []);

  const loadPlanes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await planesService.getPlanes();
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(data)) {
        setPlanes(data);
      } else if (data?.planes) {
        setPlanes(data.planes);
      } else if (data && typeof data === 'object') {
        setPlanes([]);
      } else {
        setPlanes([]);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al cargar los planes';
      setError(`Error al cargar los planes: ${errorMessage}`);
      console.error('Error cargando planes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComprar = async (planId) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para comprar un plan');
      return;
    }

    if (user.rol !== 'cliente') {
      alert('Solo los clientes pueden comprar planes');
      return;
    }

    setComprando(planId);
    try {
      const result = await comprasService.createCompra({
        plan_id: planId,
        estado: 'pendiente',
      });
      alert('Compra iniciada. Serás redirigido al sistema de pago.');
      // Aquí se integraría Mercado Pago
      console.log('Compra creada:', result);
    } catch (err) {
      alert('Error al crear la compra: ' + (err.response?.data?.error || err.message));
    } finally {
      setComprando(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Planes de Consultas Legales
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {planes.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: plan.activo ? '2px solid' : '1px solid',
                borderColor: plan.activo ? 'primary.main' : 'divider',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5" component="h2">
                    {plan.nombre}
                  </Typography>
                  {!plan.activo && <Chip label="Inactivo" size="small" color="default" />}
                </Box>

                {plan.descripcion && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {plan.descripcion}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney color="primary" />
                  <Typography variant="h4" sx={{ ml: 1 }}>
                    {plan.precio?.toLocaleString('es-ES')}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={plan.tipo === 'paquete' ? 'Paquete' : 'Suscripción'}
                    color={plan.tipo === 'paquete' ? 'primary' : 'secondary'}
                    sx={{ mb: 1 }}
                  />
                  {plan.duracion_dias && (
                    <Typography variant="body2" color="text.secondary">
                      Duración: {plan.duracion_dias} días
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {plan.cantidad_consultas} consulta{plan.cantidad_consultas > 1 ? 's' : ''}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleComprar(plan.id)}
                  disabled={!plan.activo || comprando === plan.id || user?.rol !== 'cliente'}
                >
                  {comprando === plan.id
                    ? 'Procesando...'
                    : user?.rol !== 'cliente'
                      ? 'Solo para clientes'
                      : 'Comprar Plan'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {planes.length === 0 && !loading && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No hay planes disponibles en este momento.
        </Alert>
      )}
    </Layout>
  );
};

export default Planes;

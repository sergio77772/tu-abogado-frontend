import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add, Message, History } from '@mui/icons-material';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { consultasService } from '../services/consultasService';
import { comprasService } from '../services/comprasService';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

const PanelCliente = () => {
  const [consultasDisponibles, setConsultasDisponibles] = useState(0);
  const [consultas, setConsultas] = useState([]);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    compra_id: '',
    asunto: '',
    mensaje_inicial: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [consultasData, comprasData] = await Promise.all([
        consultasService.getConsultas(null, 'disponibles'),
        comprasService.getCompras(),
      ]);

      setConsultasDisponibles(consultasData.consultas_disponibles || 0);
      setConsultas(consultasData.consultas || []);
      setCompras(Array.isArray(comprasData) ? comprasData : comprasData.compras || []);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormData({ compra_id: '', asunto: '', mensaje_inicial: '' });
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitConsulta = async () => {
    if (!formData.compra_id || !formData.asunto || !formData.mensaje_inicial) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setError('');
      await consultasService.createConsulta(formData);
      setSuccess('Consulta creada exitosamente');
      handleCloseDialog();
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la consulta');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'abierta':
        return 'warning';
      case 'respondida':
        return 'success';
      case 'cerrada':
        return 'default';
      default:
        return 'default';
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
    <ProtectedRoute allowedRoles={['cliente']}>
      <Layout>
        <Typography variant="h4" gutterBottom>
          Panel de Cliente
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Consultas Disponibles
                </Typography>
                <Typography variant="h3" color="primary">
                  {consultasDisponibles}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Compras Realizadas
                </Typography>
                <Typography variant="h3" color="secondary">
                  {compras.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Consultas Totales
                </Typography>
                <Typography variant="h3" color="text.secondary">
                  {consultas.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Mis Consultas</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenDialog}
            disabled={consultasDisponibles === 0}
          >
            Nueva Consulta
          </Button>
        </Box>

        {consultasDisponibles === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No tienes consultas disponibles. Compra un plan para obtener consultas.
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Asunto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Abogado</TableCell>
                <TableCell>Fecha Creación</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultas.map((consulta) => (
                <TableRow key={consulta.id}>
                  <TableCell>{consulta.id}</TableCell>
                  <TableCell>{consulta.asunto}</TableCell>
                  <TableCell>
                    <Chip
                      label={consulta.estado}
                      color={getEstadoColor(consulta.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{consulta.abogado_nombre || 'Sin asignar'}</TableCell>
                  <TableCell>
                    {consulta.fecha_creacion
                      ? format(new Date(consulta.fecha_creacion), 'dd/MM/yyyy HH:mm', {
                          locale: es,
                        })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<Message />}
                      onClick={() => {
                        // Mostrar detalles de la consulta
                        alert(
                          `Consulta #${consulta.id}\n\nAsunto: ${consulta.asunto}\n\nMensaje: ${consulta.mensaje_inicial}\n\nRespuesta: ${consulta.respuesta || 'Sin respuesta aún'}`
                        );
                      }}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {consultas.length === 0 && (
          <Alert severity="info" sx={{ mt: 3 }}>
            No tienes consultas realizadas.
          </Alert>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Nueva Consulta Legal</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <TextField
              fullWidth
              select
              label="Compra asociada"
              name="compra_id"
              value={formData.compra_id}
              onChange={handleChange}
              margin="normal"
              SelectProps={{
                native: true,
              }}
              required
            >
              <option value="">Selecciona una compra</option>
              {compras
                .filter((c) => c.consultas_disponibles > 0)
                .map((compra) => (
                  <option key={compra.id} value={compra.id}>
                    Plan: {compra.plan_nombre} - {compra.consultas_disponibles} consultas
                    disponibles
                  </option>
                ))}
            </TextField>

            <TextField
              fullWidth
              label="Asunto"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Mensaje"
              name="mensaje_inicial"
              value={formData.mensaje_inicial}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={6}
              required
              helperText="Describe tu consulta legal de manera detallada"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSubmitConsulta} variant="contained">
              Enviar Consulta
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </ProtectedRoute>
  );
};

export default PanelCliente;

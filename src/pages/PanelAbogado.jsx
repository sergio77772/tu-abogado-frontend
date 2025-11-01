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
import { Message, CheckCircle } from '@mui/icons-material';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { consultasService } from '../services/consultasService';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

const PanelAbogado = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadConsultas();
  }, []);

  const loadConsultas = async () => {
    try {
      setLoading(true);
      const data = await consultasService.getConsultas(null, 'pendientes');
      setConsultas(Array.isArray(data) ? data : data.consultas || []);
    } catch (err) {
      setError('Error al cargar las consultas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (consulta) => {
    setConsultaSeleccionada(consulta);
    setRespuesta(consulta.respuesta || '');
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setConsultaSeleccionada(null);
    setRespuesta('');
  };

  const handleResponder = async () => {
    if (!respuesta.trim()) {
      setError('Debes escribir una respuesta');
      return;
    }

    try {
      setError('');
      await consultasService.updateConsulta(consultaSeleccionada.id, {
        respuesta: respuesta,
      });
      setSuccess('Respuesta enviada exitosamente');
      setTimeout(() => {
        handleCloseDialog();
        loadConsultas();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar la respuesta');
    }
  };

  const handleCerrarConsulta = async (consultaId) => {
    if (!window.confirm('¿Deseas cerrar esta consulta?')) {
      return;
    }

    try {
      await consultasService.updateConsulta(consultaId, {
        cerrar: true,
      });
      loadConsultas();
    } catch (err) {
      alert('Error al cerrar la consulta');
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

  const consultasPendientes = consultas.filter((c) => c.estado === 'abierta');
  const consultasRespondidas = consultas.filter((c) => c.estado === 'respondida');

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
    <ProtectedRoute allowedRoles={['abogado']}>
      <Layout>
        <Typography variant="h4" gutterBottom>
          Panel de Abogado
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Consultas Pendientes
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {consultasPendientes.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Consultas Respondidas
                </Typography>
                <Typography variant="h3" color="success.main">
                  {consultasRespondidas.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Consultas
                </Typography>
                <Typography variant="h3" color="text.secondary">
                  {consultas.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Consultas Pendientes de Respuesta
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Asunto</TableCell>
                <TableCell>Mensaje</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultasPendientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No hay consultas pendientes
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                consultasPendientes.map((consulta) => (
                  <TableRow key={consulta.id}>
                    <TableCell>{consulta.id}</TableCell>
                    <TableCell>{consulta.cliente_nombre}</TableCell>
                    <TableCell>{consulta.asunto}</TableCell>
                    <TableCell>
                      {consulta.mensaje_inicial?.substring(0, 50)}...
                    </TableCell>
                    <TableCell>
                      {consulta.fecha_creacion
                        ? format(new Date(consulta.fecha_creacion), 'dd/MM/yyyy HH:mm', {
                            locale: es,
                          })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={consulta.estado}
                        color={getEstadoColor(consulta.estado)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<Message />}
                        onClick={() => handleOpenDialog(consulta)}
                        variant="contained"
                      >
                        Responder
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Historial de Consultas
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Asunto</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultas
                .filter((c) => c.estado !== 'abierta')
                .map((consulta) => (
                  <TableRow key={consulta.id}>
                    <TableCell>{consulta.id}</TableCell>
                    <TableCell>{consulta.cliente_nombre}</TableCell>
                    <TableCell>{consulta.asunto}</TableCell>
                    <TableCell>
                      {consulta.fecha_creacion
                        ? format(new Date(consulta.fecha_creacion), 'dd/MM/yyyy HH:mm', {
                            locale: es,
                          })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={consulta.estado}
                        color={getEstadoColor(consulta.estado)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleOpenDialog(consulta)}
                      >
                        Ver
                      </Button>
                      {consulta.estado === 'respondida' && consulta.estado !== 'cerrada' && (
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => handleCerrarConsulta(consulta.id)}
                          sx={{ ml: 1 }}
                        >
                          Cerrar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            Consulta #{consultaSeleccionada?.id} - {consultaSeleccionada?.asunto}
          </DialogTitle>
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

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Cliente: {consultaSeleccionada?.cliente_nombre}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Fecha:{' '}
                {consultaSeleccionada?.fecha_creacion
                  ? format(new Date(consultaSeleccionada.fecha_creacion), 'dd/MM/yyyy HH:mm', {
                      locale: es,
                    })
                  : '-'}
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Mensaje del cliente"
              value={consultaSeleccionada?.mensaje_inicial || ''}
              margin="normal"
              multiline
              rows={4}
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Tu respuesta"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              margin="normal"
              multiline
              rows={6}
              required
              disabled={consultaSeleccionada?.estado === 'cerrada'}
              helperText={
                consultaSeleccionada?.estado === 'cerrada'
                  ? 'Esta consulta está cerrada'
                  : 'Escribe tu respuesta legal detallada'
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cerrar</Button>
            {consultaSeleccionada?.estado !== 'cerrada' && (
              <Button
                onClick={handleResponder}
                variant="contained"
                startIcon={<CheckCircle />}
                disabled={!respuesta.trim()}
              >
                Enviar Respuesta
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Layout>
    </ProtectedRoute>
  );
};

export default PanelAbogado;

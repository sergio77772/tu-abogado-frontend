import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { People, ShoppingCart, Scale, AttachMoney } from '@mui/icons-material';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { adminService } from '../services/adminService';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

const PanelAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [abogados, setAbogados] = useState([]);
  const [compras, setCompras] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
    loadUsers();
    loadAbogados();
    loadCompras();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : data.usuarios || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAbogados = async () => {
    try {
      const data = await adminService.getAbogados();
      setAbogados(Array.isArray(data) ? data : data.abogados || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCompras = async () => {
    try {
      const data = await adminService.getCompras();
      setCompras(Array.isArray(data) ? data : data.compras || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <Typography variant="h4" gutterBottom>
          Panel Administrativo
        </Typography>

        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <People color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Usuarios</Typography>
                  </Box>
                  <Typography variant="h4">
                    {stats.usuarios?.total || stats.usuarios || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Scale color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Planes Activos</Typography>
                  </Box>
                  <Typography variant="h4">{stats.planes_activos || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ShoppingCart color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Compras</Typography>
                  </Box>
                  <Typography variant="h4">
                    {stats.compras?.total || stats.compras || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoney color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6">Ingresos</Typography>
                  </Box>
                  <Typography variant="h4">
                    ${stats.ingresos_totales?.toLocaleString('es-ES') || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Usuarios" />
            <Tab label="Abogados" />
            <Tab label="Compras" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.rol}
                        color={
                          user.rol === 'admin'
                            ? 'error'
                            : user.rol === 'abogado'
                              ? 'secondary'
                              : 'primary'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Consultas Totales</TableCell>
                  <TableCell>Respondidas</TableCell>
                  <TableCell>Cerradas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {abogados.map((abogado) => (
                  <TableRow key={abogado.id}>
                    <TableCell>{abogado.id}</TableCell>
                    <TableCell>{abogado.nombre}</TableCell>
                    <TableCell>{abogado.email}</TableCell>
                    <TableCell>{abogado.total_consultas || 0}</TableCell>
                    <TableCell>{abogado.consultas_respondidas || 0}</TableCell>
                    <TableCell>{abogado.consultas_cerradas || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 2 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Consultas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {compras.map((compra) => (
                  <TableRow key={compra.id}>
                    <TableCell>{compra.id}</TableCell>
                    <TableCell>{compra.usuario_id}</TableCell>
                    <TableCell>{compra.plan_nombre || 'N/A'}</TableCell>
                    <TableCell>${compra.monto?.toLocaleString('es-ES') || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={compra.estado}
                        color={
                          compra.estado === 'pagada'
                            ? 'success'
                            : compra.estado === 'pendiente'
                              ? 'warning'
                              : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {compra.fecha_compra
                        ? format(new Date(compra.fecha_compra), 'dd/MM/yyyy', { locale: es })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {compra.consultas_usadas || 0}/{compra.consultas_totales || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default PanelAdmin;

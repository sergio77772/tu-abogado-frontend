import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Scale, Security, Speed, SupportAgent } from '@mui/icons-material';
import Layout from '../components/Layout';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Scale fontSize="large" color="primary" />,
      title: 'Consultas Legales',
      description: 'Accede a asesoría legal profesional cuando la necesites',
    },
    {
      icon: <Security fontSize="large" color="primary" />,
      title: 'Seguro y Confiable',
      description: 'Tus datos están protegidos con los más altos estándares',
    },
    {
      icon: <Speed fontSize="large" color="primary" />,
      title: 'Rápido y Fácil',
      description: 'Consulta con abogados en minutos desde cualquier lugar',
    },
    {
      icon: <SupportAgent fontSize="large" color="primary" />,
      title: 'Expertos Calificados',
      description: 'Abogados profesionales listos para ayudarte',
    },
  ];

  return (
    <Layout>
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
          mb: 6,
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Tu Abogado en Línea
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Asesoría legal profesional a un clic de distancia
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/planes')}
            sx={{ mr: 2 }}
          >
            Ver Planes
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Registrarse
          </Button>
        </Container>
      </Box>

      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        ¿Por qué elegirnos?
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          ¿Listo para comenzar?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Elige el plan que mejor se adapte a tus necesidades y obtén asesoría legal
          profesional hoy mismo.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/planes')}
          sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
        >
          Ver Planes Disponibles
        </Button>
      </Card>
    </Layout>
  );
};

export default Home;

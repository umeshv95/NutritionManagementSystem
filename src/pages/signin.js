import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import newImage from '../images/secondimage.png'; // Updated image
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const skyBlueTheme = createTheme({
  palette: {
    primary: { main: '#00bfff' }, // Sky Blue
    text: { primary: '#000' },
    background: { default: 'green' }, // Light Green background color
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'white',
          backgroundColor: 'green',
          '&:hover': { backgroundColor: 'green' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': { color: 'black' }, // Set text color inside text field to black
          '& .MuiInputLabel-root': { color: 'black' }, // Set label color to black
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'black' }, // Border color of text field
            '&:hover fieldset': { borderColor: 'black' }, // Border color on hover
            '&.Mui-focused fieldset': { borderColor: 'black' }, // Border color when focused
          },
        },
      },
    },
  },
});

export default function Login() {
  const [formData, setFormData] = React.useState({ email: '', password: '' });
  const [errors, setErrors] = React.useState({});
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: '' });
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackbar({ open: true, message: 'Please fix the errors', severity: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const result = await response.json();

      if (response.ok) {
        sessionStorage.setItem('authToken', result.token);
        sessionStorage.setItem('email', formData.email);
        navigate('/Dashboard');
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error logging in, please try again later.', severity: 'error' });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  React.useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  return (
    <ThemeProvider theme={skyBlueTheme}>
      <div style={{ overflowX: 'hidden', width: '100vw', background: '#b2e8b2' }}> {/* Light green background */}
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 100px)', marginTop: '100px' }}>
          <Container component="main" maxWidth="lg">
            <CssBaseline />
            <Card sx={{ boxShadow: 3, borderRadius: 3, display: 'flex', height: '650px', maxWidth: '800px', transition: 'transform 0.3s', marginLeft: '140px', background: '#fff' }}>
              <Grid container>
                <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography component="h1" variant="h5" sx={{ fontWeight: 800, color: 'black' }}>
                        Login
                      </Typography>
                      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          autoFocus
                          value={formData.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                          InputLabelProps={{ shrink: true, style: { color: 'black' } }} // Set label color to black
                          sx={{ backgroundColor: 'white', borderRadius: '10px' }}
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          error={!!errors.password}
                          helperText={errors.password}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{ shrink: true, style: { color: 'black' } }} // Set label color to black
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                          Login
                        </Button>
                        <Typography variant="body2" align="center" sx={{ mt: 2, mb: 2 }}>
                          Or login with
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                          <Button variant="contained" color="primary">
                            Google
                          </Button>
                          <Button variant="contained" color="primary">
                            Facebook
                          </Button>
                          <Button variant="contained" color="primary">
                            Twitter
                          </Button>
                        </Box>
                        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                          Don't have an account?{' '}
                          <Link
                            href="/signup"
                            sx={{
                              textDecoration: 'underline', // Underline the link
                              textDecorationColor: 'black', // Set the underline color to black
                            }}
                          >
                            Sign Up
                          </Link>
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={6}>
                  <CardMedia component="img" alt="login" height="100%" image={newImage} />
                </Grid>
              </Grid>
            </Card>
          </Container>
        </div>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

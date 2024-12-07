import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Card,
  Grid,
  createTheme,
  ThemeProvider,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  MenuItem,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import HeightIcon from '@mui/icons-material/Height';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const skyBlueTheme = createTheme({
  palette: {
    primary: {
      main: '#00bfff', // Sky Blue
    },
    secondary: {
      main: '#00bfff',
    },
    text: {
      primary: '#000',
    },
    background: {
      default: '#E8F5E9', // Light Green
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fff',
          backgroundColor: 'green', // Sky Blue
          '&:hover': {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: '#000',
          },
          '& .MuiInputLabel-root': {
            color: '#000',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000',
            },
            '&:hover fieldset': {
              borderColor: '#000',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00bfff',
            },
          },
        },
      },
    },
  },
});

export default function SignUp() {
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthDate: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    setFormSubmitted(true);
    if (!formData.Name) tempErrors.Name = 'Name is required.';
    if (!formData.email) {
      tempErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is not valid.';
    }
    if (formData.password.length < 8) tempErrors.password = 'Password must be at least 8 characters long.';
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match.';
    if (!formData.confirmPassword) tempErrors.confirmPassword = 'Confirm Password is required.';
    if (!formData.gender) tempErrors.gender = 'Gender is required.';
    if (!formData.birthDate) {
      tempErrors.birthDate = 'Birth Date is required.';
    }
    if (!formData.heightFeet) tempErrors.heightFeet = 'Height (Feet) is required.';
    if (!formData.heightInches) tempErrors.heightInches = 'Height (Inches) is required.';
    if (!formData.weight) tempErrors.weight = 'Weight is required.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setSnackbarMessage('Please fix the errors before submitting.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const existingUserResponse = await axios.get(`http://localhost:8080/users/check-email?email=${formData.email}`);
      if (existingUserResponse.data.exists) {
        setSnackbarMessage('User already exists.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const response = await axios.post('http://localhost:8080/users', {
        name: formData.Name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        birthDate: formData.birthDate,
        heightFeet: formData.heightFeet,
        heightInches: formData.heightInches,
        weight: formData.weight,
      });
      console.log('User registered successfully:', response.data);
      setSnackbarMessage('User registered successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setFormData({
        Name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        birthDate: '',
        heightFeet: '',
        heightInches: '',
        weight: '',
      });
    } catch (error) {
      console.error('There was an error registering the user:', error);
      setSnackbarMessage('There was an error registering the user.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const bodyStyle = document.body.style;
    bodyStyle.overflowX = 'hidden';
    bodyStyle.overflowY = 'scroll';

    return () => {
      bodyStyle.overflowX = 'unset';
      bodyStyle.overflowY = 'unset';
    };
  }, []);

  return (
    <ThemeProvider theme={skyBlueTheme}>
      <Navbar />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Container
        component="main"
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
          <Card
            sx={{
              padding: 4,
              width: '100%',
              backgroundColor: '#E8F5E9',
              boxShadow: 10,
              borderRadius: 4,
              border: '1px solid #e0e0e0',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 15,
              },
            }}
          >
            <Typography component="h1" variant="h5" color="text.primary" sx={{ marginBottom: 2, textAlign: 'center' }}>
              Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                {/* Sign Up Form Fields */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    required
                    margin="normal"
                    error={!!errors.Name}
                    helperText={errors.Name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    select
                    required
                    margin="normal"
                    error={!!errors.gender}
                    helperText={errors.gender}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Birth Date"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    margin="normal"
                    error={!!errors.birthDate}
                    helperText={errors.birthDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Height (Feet)"
                        name="heightFeet"
                        value={formData.heightFeet}
                        onChange={handleChange}
                        required
                        margin="normal"
                        error={!!errors.heightFeet}
                        helperText={errors.heightFeet}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <HeightIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Height (Inches)"
                        name="heightInches"
                        value={formData.heightInches}
                        onChange={handleChange}
                        required
                        margin="normal"
                        error={!!errors.heightInches}
                        helperText={errors.heightInches}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    fullWidth
                    label="Weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    margin="normal"
                    error={!!errors.weight}
                    helperText={errors.weight}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FitnessCenterIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={formSubmitted}
              >
                Sign Up
              </Button>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ marginTop: 2 }}
            >
              Already have an account?{' '}
              <Button
                onClick={() => (window.location.href = '/signin')}
                sx={{ textTransform: 'none' }}
              >
                Sign In
              </Button>
            </Typography>
          </Card>
        </Box>
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

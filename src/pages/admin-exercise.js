import React, { useState, useEffect } from 'react';
import Navbar from '../components/Adminnav';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';

const AddExercise = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    energy: '',
    fat: '',
    netCarbs: '',
    protein: '',
  });

  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userName');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken || !username) {
      navigate('/');
    } else {
      axios
        .get(`http://localhost:8080/admin?username=${username}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          if (response.data.user && response.data.user.username) {
            sessionStorage.setItem('userName', response.data.user.username);
          }
        })
        .catch((error) => {
          console.error(
            'Error fetching user data:',
            error.response ? error.response.data : error.message
          );
        });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('image', formData.image);
    data.append('energy', formData.energy);
    data.append('fat', formData.fat);
    data.append('netCarbs', formData.netCarbs);
    data.append('protein', formData.protein);

    try {
      const response = await axios.post('http://localhost:8080/exercise', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSnackbar({ open: true, message: 'Exercise added successfully!', severity: 'success' });
        setFormData({
          name: '',
          image: null,
          energy: '',
          fat: '',
          netCarbs: '',
          protein: '',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add exercise. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Navbar handleLogout={handleLogout} />
      <main style={{ padding: '2rem' }}>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'lightgreen',
              transition: 'transform 0.3s ease, text-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                textShadow: '0 4px 10px rgba(0, 186, 255, 0.5)',
              },
            }}
          >
            Add New Exercise
          </Typography>
        </Box>

        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
          <Card
            sx={{
              width: '100%',
              maxWidth: 900,
              padding: 4,
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(0, 143, 204, 0.3)',
              borderRadius: '12px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 8px 20px rgba(0, 186, 255, 0.5)',
              },
            }}
          >
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Exercise Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Upload Image"
                    type="file"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleImageUpload}
                    fullWidth
                    required
                    inputProps={{
                      accept: 'image/*',
                    }}
                  />
                  {formData.image && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: 'italic' }}
                    >
                      {formData.image.name}
                    </Typography>
                  )}
                  <TextField
                    label="Energy Required(kcal)"
                    name="energy"
                    value={formData.energy}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    type="number"
                  />
                  <TextField
                    label="Fat Burned(g)"
                    name="fat"
                    value={formData.fat}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    type="number"
                  />
                  <TextField
                    label="Net Carbs Burned (g)"
                    name="netCarbs"
                    value={formData.netCarbs}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    type="number"
                  />
                  <TextField
                    label="Protein Burned (g)"
                    name="protein"
                    value={formData.protein}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    type="number"
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      backgroundColor: 'lightgreen',
                      color: 'black',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: '#lightgreen',
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </main>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddExercise;

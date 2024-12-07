import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function ButtonAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#E8F5E9', // Light green background
          color: '#E8F5E9', // Dark text for contrast
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          height: '64px', // Fixed height for consistency
          transition: 'background-color 0.3s ease', // Smooth transition
          width: '100%',
        }}
      >
        <Toolbar>
          {/* Logo and home link */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }}
            onClick={() => window.location.href = '/'}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: 'green', // Sky blue color for logo
                fontWeight: 'bold',
                fontSize: '1.5rem',
                marginRight: '8px',
              }}
            >
              🍏 Healthy Bite
            </Typography>
          </Box>

          {/* About Us button */}
          <Button
            sx={{
              color: 'white',
              backgroundColor: 'green', // Sky blue color
              '&:hover': {
                backgroundColor: '#E8F5E9', // Darker blue on hover
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow on hover
              },
              marginRight: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              padding: '12px 25px',
              borderRadius: '25px', // Larger rounded corners
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onClick={() => window.location.href = '/about'}
          >
            About Us
          </Button>

          {/* Sign In Button with Dropdown */}
          <Button
            sx={{
              color: 'white',
              backgroundColor: 'green',
              '&:hover': {
                backgroundColor: '#E8F5E9',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow on hover
              },
              display: 'flex',
              alignItems: 'center',
              padding: '12px 25px',
              borderRadius: '25px', // Rounded corners
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
            onClick={handleMenuClick}
          >
            Sign In
            <ArrowDropDownIcon sx={{ ml: 0.5 }} />
          </Button>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            disableScrollLock={true}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              mt: 1,
              '& .MuiMenuItem-root': {
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: '#f0f0f0', // Light gray on hover
                },
              },
            }}
          >
            <MenuItem onClick={() => { window.location.href = '/signin'; handleClose(); }}>
              User Sign In
            </MenuItem>
            <MenuItem onClick={() => { window.location.href = '/admin-signin'; handleClose(); }}>
              Admin Sign In
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

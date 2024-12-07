import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle'; // Add this line
import StatisticsIcon from '@mui/icons-material/QueryStats';
import AddExerciseIcon from '@mui/icons-material/FitnessCenter';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalDiningIcon from '@mui/icons-material/LocalDining'; // Icon for Food Stats
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import Calendar from "react-calendar";
import '../Styles/Enhanced.css';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LineElement, LinearScale, PointElement, BarElement } from "chart.js";
import CircularProgress from '@mui/material/CircularProgress';
import { faAppleAlt, faHeartbeat, faCarrot, faBacon  } from "@fortawesome/free-solid-svg-icons"; // FontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Modal,
} from '@mui/material';




const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: 'lightgreen',  // Sky blue color for the opened drawer
  borderBottomRightRadius: '50px',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  backgroundColor: 'lightgreen',  // Sky blue color for the closed drawer
  borderBottomRightRadius: '50px',
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: 'lightgreen',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

export default function FoodStatistics() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foodItems, setFoodItems] = useState([]);
  const [popupDetails, setPopupDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);


  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const email = sessionStorage.getItem("email");
  const authToken = sessionStorage.getItem("authToken");

  // Redirect to login if no token or email
  useEffect(() => {
    if (!authToken || !email) {
      navigate("/"); // Redirect to login
    }
  }, [authToken, email, navigate]);

  // Fetch food items based on the selected date
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        // Adjust date for timezone offset before formatting
        const formattedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];

        const response = await axios.get(
          `http://localhost:8080/fooddiary/list/${formattedDate}`,
          {
            headers: {
              email: email,
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setFoodItems(response.data);
      } catch (error) {
        console.error("Error fetching food items:", error.response?.data || error.message);
      }
    };

    if (email && authToken) {
      fetchFoodItems();
    }
  }, [selectedDate, email, authToken]);

  // Delete a food item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/fooddiary/delete/${id}`, {
        headers: {
          email: email,
          Authorization: `Bearer ${authToken}`,
          
        },
      });
      setFoodItems(foodItems.filter((item) => item.id !== id));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting food items:", error.response?.data || error.message);
    }
  };

  // Show details of a food item
  const handleShowDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/fooddiary/details/${id}`,
        {
          headers: {
            email: email,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setPopupDetails(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching food items:", error.response?.data || error.message);
    }
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("email");
    navigate("/"); // Redirect to login
    window.location.reload();
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleFood = () => {
    navigate('/addfood');
  };

  const handleFoodStats = () => {
    navigate('/foodstats');
    window.location.reload();
  };

  const handleExerciseStats = () => {
    navigate('/exercisestats');
    window.location.reload();
  };

  const toggleStatsDropdown = () => {
    setOpenStats(!openStats); // Toggle dropdown visibility
  };

  const handleExercise = () => {
    navigate('/addexercise');
  };

  const handleAccount = () => {
    navigate('/account');
  };

  const [page, setPage] = useState(0); // Current page
  const rowsPerPage = 2; // Rows per page (fixed to 5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0); // Reset to the first page
  };


  const [stats, setStats] = useState(null); // For stats section 
  // Fetch stats for selected date
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Adjust date for timezone offset before formatting
        const formattedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];
        const response = await axios.get(
          `http://localhost:8080/fooddiary/stats/${formattedDate}`,
          { headers: { email } }
        );
        setStats(response.data || {});  // Set an empty object if response is null or undefined
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({});  // Handle error by setting an empty object
      }
    };

    if (selectedDate) {
      fetchStats();
    }
  }, [selectedDate, email]);

  ChartJS.register(
    CategoryScale, // Register CategoryScale
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    BarElement
  );






  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{ marginRight: 5 }, open && { display: 'none' }]}
          >
            <MenuIcon sx={{ color: 'black', fontSize: '32px' }} />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="black">
            Food Statistics
          </Typography>
          {/* Logout Button in the Right Corner */}
          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon sx={{ color: 'black' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          {open && (
            <Typography
              variant="h6"
              sx={{
                color: 'Black',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                flexGrow: 1,
                marginLeft: open ? '-30px' : '0px',
              }}
            >
              Menu
            </Typography>
          )}
        </DrawerHeader>
        <Divider />
        <Box sx={{ flexGrow: 1 }}>
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleDashboard}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleFood}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Food" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleExercise}>
                <ListItemIcon>
                  <AddExerciseIcon />
                </ListItemIcon>
                <ListItemText primary="Add Exercise" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>

            {/* Statistics with dropdown for Food Stats and Exercise Stats */}
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={toggleStatsDropdown}>
                <ListItemIcon>
                  <StatisticsIcon />
                </ListItemIcon>
                <ListItemText primary="Statistics" sx={{ opacity: 1 }} />
                <ExpandMoreIcon sx={{ transform: openStats ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
              </ListItemButton>

              {/* Dropdown for Food Stats and Exercise Stats */}
              {openStats && (
                <List component="div" disablePadding>
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton onClick={handleFoodStats}>
                      <ListItemIcon>
                        <LocalDiningIcon /> {/* Food Stats icon */}
                      </ListItemIcon>
                      <ListItemText primary="Food Stats" sx={{ opacity: 1 }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton onClick={handleExerciseStats}>
                      <ListItemIcon>
                        <SportsMartialArtsIcon /> {/* Exercise Stats icon */}
                      </ListItemIcon>
                      <ListItemText primary="Exercise Stats" sx={{ opacity: 1 }} />
                    </ListItemButton>
                  </ListItem>
                </List>
              )}
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={handleAccount}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Account" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* main content  */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: "center",
            alignItems: 'flex-start',
            padding: '16px',
            marginTop: '60px',
            marginLeft:'20px',
          }}
        >
          {/* Food Items Table */}
          <Box
            sx={{
              flex: 2,
              padding: 2,
              borderRadius: '10px',
              width: '1000px',
            }}
          >
            <TableContainer component={Paper}
              sx={{
                borderRadius: '8px',
                overflowY: 'auto',
                boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
                '&:hover': {
                  transform: 'scale(1.01)',
                  boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
                },
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
              }}
            >
              <Table padding="dense">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'lightgreen' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'right',
                        padding: '20px',
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Pagination logic */}
                  {rowsPerPage > 0
                    ? foodItems
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell
                            sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleShowDetails(item.id)}
                              sx={{
                                borderColor: 'lightgreen',
                                color: 'lightgreen',
                                '&:hover': { backgroundColor: 'lightgreeen' },
                              }}
                            >
                              Details
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => handleDelete(item.id)}
                              sx={{ color: 'white' }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
                <TableFooter
                  sx={{
                    position: 'sticky', // Makes the footer stick to its parent
                    marginBottom: 0, // Aligns the footer to the bottom
                    backgroundColor: 'lightgreen', // Background to visually separate it
                    borderTop: '1px solid #e0e0e0', // Optional: Divider above footer
                    zIndex: 1, // Ensures it appears above scrollable content
                  }}
                >
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[2]}
                      colSpan={2}
                      count={foodItems.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>

          </Box>
        </Box>
        {/* stats */}
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 3,
            ml: "15px",
            marginBottom: 4,
            width: "100%",
            
          }}
        >
          {/* Title Section */}
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold" sx={{ color: "#333" }}>
            Food Statistics for {selectedDate.toDateString()}
          </Typography>

          {/* Info Box with Circular Progress Indicators */}
          {stats ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                marginBottom: 3,
                flexWrap: "wrap",
              }}
            >
              {/* Protein Burned Card */}
              <Box
                sx={{
                  padding: 3,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  width: "220px",
                  backgroundColor: "white",
                  boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
                  },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  {/* Background Circle (Gray) */}
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={120}
                    thickness={5}
                    sx={{
                      color: "#f0f0f0", // Gray background circle
                    }}
                  />
                  {/* Colored Progress Circle (Protein Burned) */}
                  <CircularProgress
                    variant="determinate"
                    value={(stats.totalProtein / 1000) * 100} // Protein burned progress
                    size={120}
                    thickness={5}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#ff6347", // Colored section (Protein)

                    }}
                  />
                  {/* Icon in the center of the circle */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%",  // Center vertically
                      left: "50%",  // Center horizontally
                      transform: "translate(-50%, -50%)", // Perfectly center the icon
                      zIndex: 1,
                    }}
                  >
                    <FontAwesomeIcon icon={faAppleAlt} style={{ color: "#ff6347", fontSize: "40px" }} />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ color: "#ff6347", fontWeight: "bold", marginTop: 2 }}>
                  Protein Intake
                </Typography>
                <Typography variant="h4" sx={{ color: "#ff6347", fontWeight: "bold",fontSize: "1.5rem" }}>
                  {stats.totalProtein} g / 1000 g
                </Typography>
              </Box>

              {/* Energy Burned Card */}
              <Box
                sx={{
                  padding: 3,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  width: "220px",
                  backgroundColor: "white",
                  boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
                  },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  {/* Background Circle (Gray) */}
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={120}
                    thickness={5}
                    sx={{
                      color: "#f0f0f0", // Gray background circle
                    }}
                  />
                  {/* Colored Progress Circle (Energy Burned) */}
                  <CircularProgress
                    variant="determinate"
                    value={(stats.totalEnergy / 2000) * 100} // Energy burned progress
                    size={120}
                    thickness={5}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#00bfff", // Colored section (Energy)
                    }}
                  />
                  {/* Icon in the center of the circle */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%", // Center vertically
                      left: "50%", // Center horizontally
                      transform: "translate(-50%, -50%)", // Perfectly center the icon
                      zIndex: 1,
                    }}
                  >
                    <FontAwesomeIcon icon={faHeartbeat} style={{ color: "#00bfff", fontSize: "40px" }} />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ color: "#00bfff", fontWeight: "bold", marginTop: 2 }}>
                  Energy Intake
                </Typography>
                <Typography variant="h4" sx={{ color: "#00bfff", fontWeight: "bold" ,fontSize: "1.5rem"}}>
                  {stats.totalEnergy} kcal / 2000 kcal
                </Typography>
              </Box>

              {/* Carbs Burned Card */}
              <Box
                sx={{
                  padding: 3,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  width: "220px",
                  backgroundColor: "white",
                  boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
                  },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  {/* Background Circle (Gray) */}
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={120}
                    thickness={5}
                    sx={{
                      color: "#f0f0f0", // Gray background circle
                    }}
                  />
                  {/* Colored Progress Circle (Carbs Burned) */}
                  <CircularProgress
                    variant="determinate"
                    value={(stats.totalNetCarbs / 300) * 100} // Carbs burned progress
                    size={120}
                    thickness={5}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#ffeb3b", // Colored section (Carbs)
                    }}
                  />
                  {/* Icon in the center of the circle */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%", // Center vertically
                      left: "50%", // Center horizontally
                      transform: "translate(-50%, -50%)", // Perfectly center the icon
                      zIndex: 1,
                    }}
                  >
                    <FontAwesomeIcon icon={faCarrot} style={{ color: "#ffeb3b", fontSize: "40px" }} />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ color: "#ffeb3b", fontWeight: "bold", marginTop: 2 }}>
                  Carbs Intake
                </Typography>
                <Typography variant="h4" sx={{ color: "#ffeb3b", fontWeight: "bold", fontSize: "1.5rem" }}>
                  {stats.totalNetCarbs} g / 300 g
                </Typography>

              </Box>

              {/* Fat Burned Card */}
              <Box
                sx={{
                  padding: 3,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  width: "220px",
                  backgroundColor: "white",
                  boxShadow: '0 8px 20px rgba(0, 191, 255, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0px 4px 15px 5px rgba(0, 191, 255, 0.5)', // Sky blue box shadow
                  },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  {/* Background Circle (Gray) */}
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={120}
                    thickness={5}
                    sx={{
                      color: "#f0f0f0", // Gray background circle
                    }}
                  />
                  {/* Colored Progress Circle (Fat Burned) */}
                  <CircularProgress
                    variant="determinate"
                    value={(stats.totalFat / 100) * 100} // Fat burned progress
                    size={120}
                    thickness={5}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#ff9800", // Colored section (Fat)
                    }}
                  />
                  {/* Icon in the center of the circle */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%", // Center vertically
                      left: "50%", // Center horizontally
                      transform: "translate(-50%, -50%)", // Perfectly center the icon
                      zIndex: 1,
                    }}
                  >
                    <FontAwesomeIcon icon={faBacon } style={{ color: "#ff9800", fontSize: "40px" }} />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ color: "#ff9800", fontWeight: "bold", marginTop: 2 }}>
                  Fat Intake
                </Typography>
                <Typography variant="h4" sx={{ color: "#ff9800", fontWeight: "bold", fontSize: "1.5rem" }}>
                  {stats.totalFat} g / 100 g
                </Typography>
              </Box>
            </Box>
          ) : (
            <CircularProgress />
          )}
        </Box>


        {/* Popup for Food Details */}
        <Modal
          open={showPopup && popupDetails}
          onClose={() => setShowPopup(false)}
          aria-labelledby="food-details-modal"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 400,
              backgroundColor: 'white',
              padding: 3,
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
            }}
          >
            {popupDetails ? (
              <>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  {popupDetails.name || 'No Name Available'}
                </Typography>
                <Typography>Energy: {popupDetails.energy || 'N/A'} kcal</Typography>
                <Typography>Protein: {popupDetails.protein || 'N/A'} g</Typography>
                <Typography>Fat: {popupDetails.fat || 'N/A'} g</Typography>
                <Typography>Net Carbs: {popupDetails.netCarbs || 'N/A'} g</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowPopup(false)}
                  sx={{ marginTop: 2 }}
                >
                  Close
                </Button>
              </>
            ) : (
              <Typography>No details available</Typography>
            )}
          </Box>
        </Modal>
      </Box>
      <div className="container mt-5 d-flex justify-content-center">
      
      </div>
    </Box>
  );
}
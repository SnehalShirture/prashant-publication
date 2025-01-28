import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Menu, MenuItem, IconButton, Avatar, Box } from "@mui/material";

// React Router and Redux
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Internal Utilities and Redux Actions
import { logout } from "../../reduxwork/UserSlice";
import { userlogout } from "../../apiCalls/UserApi";
import { useAlert } from "../../custom/CustomAlert";

// Internal Components
import SAdminDashboard from "./SAdminDashboard";
import AddBookForm from "./AddBook";
import AllBooks from "./AllBooks";
import AllColleges from "./AllColleges";



const SuperAdminAppBar = () => {
  const { showAlert } = useAlert();
  const [tabValue, setTabValue] = React.useState("dashboard");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { UserData } = useSelector((state) => state.user);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      if (!UserData || !UserData._id) {
        console.error("User data is missing.");
        return;
      }

      const userdata = { userId: UserData.user_id._id};
      const res = await userlogout(userdata);
      console.log("Logout Response:", res);
      showAlert("You have been logged out successfully","success")
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error.message);
      showAlert("Error logging out. Please try again later","error")
    }
  };

  return (
    <>
      {/* AppBar */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SuperAdmin Dashboard
          </Typography>
          <Tabs value={tabValue} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary">
            <Tab label="Dashboard" value="dashboard" />
            <Tab label="Books" value="books" />
            <Tab label="Other Books" value="otherbooks" />
            <Tab label="Add Books" value="addbooks" />
            <Tab label="All Users" value="allusers" />
            <Tab label="All Colleges" value="allcolleges" />
          </Tabs>
          <IconButton onClick={handleMenuClick} sx={{ ml: 2 }}>
            <Avatar alt="Profile" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Conditional Rendering */}
      <Box sx={{ mt: 2, p: 3 }}>
        {tabValue === "dashboard" &&  <SAdminDashboard/>} {/* Render Dashboard */}
        {tabValue === "books" && <AllBooks/>}
        {tabValue === "otherbooks" && <Typography>Other Books Content</Typography>}
        {tabValue === "addbooks" && <AddBookForm/>}
        {tabValue === "allusers" && <Typography>All Users Content</Typography>}
        {tabValue === "allcolleges" && <AllColleges/>}
      </Box>
    </>
  );
};

export default SuperAdminAppBar;

import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import BookIcon from "@mui/icons-material/Book";
import SubscriptionIcon from "@mui/icons-material/Subscriptions";
import { useDispatch, useSelector } from "react-redux";
import { userlogout } from "../../apiCalls/UserApi";
import { useAlert } from "../../custom/CustomAlert";
import { logout } from "../../reduxwork/UserSlice";


const CollegeAppbar = () => {
  const { showAlert } = useAlert();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);


  const { UserData } = useSelector((state) => state.user);

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navLinks = [
    { to: "/librarydashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/library/students", label: "All Students", icon: <GroupIcon /> },
    { to: "/library/books", label: "Books", icon: <BookIcon /> },
    { to: "/library/subscription", label: "Subscription", icon: <SubscriptionIcon /> },
  ];

  // Logout handler
    const handleLogout = async () => {
      try {
        const userdata = {
          userId: UserData.user_id._id,
        };
        console.log(userdata)
        const res = await userlogout(userdata);
        console.log(res);
        showAlert("You have been logged out successfully", "success")
        dispatch(logout());
        navigate("/");
      } catch (error) {
        console.log(error.message);
        showAlert("Error logging out. Please try again later", "error")
      }
    };

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#00ABE4", // Bright blue background
          color: "white",
          p: 2,
        }}
      >
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "block", sm: "none" } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
          }}
        >
          Librarian Dashboard
        </Typography>

        {/* Desktop Navigation Links */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: 3,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&:hover": {
                    color: "#ffe4c4",
                  },
                }}
              >
                {link.icon}
                {link.label}
              </Typography>
            </Link>
          ))}
        </Box>

        {/* Account Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: "#00ABE4",
                color: "white",
                borderRadius: "12px",
                p: 1,
              },
            }}
          >
            <Link to="/library/profile" style={{ textDecoration: "none" }} onClick={handleMenuClose}>
              <Typography sx={{ p: 1 }}>Profile</Typography>
            </Link>
            <Link to="/logout" style={{ textDecoration: "none" }} onClick={handleLogout}>
              <Typography sx={{ p: 1 }}>Logout</Typography>
            </Link>
          </Menu>
        </Box>
      </Box>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            background: "#00ABE4",
            color: "white",
          },
        }}
      >
        <List>
          {navLinks.map((link) => (
            <Link
              to={link.to}
              key={link.label}
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={toggleDrawer(false)}
            >
              <ListItem
                button
                sx={{
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default CollegeAppbar;

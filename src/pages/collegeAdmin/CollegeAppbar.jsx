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
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShelfIcon from "@mui/icons-material/Store";
import BookIcon from "@mui/icons-material/Book";
import SubscriptionIcon from "@mui/icons-material/Subscriptions";
import LoginIcon from "@mui/icons-material/Login";
import GroupIcon from '@mui/icons-material/Group';

const CollegeAppbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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
    { to: "/library/all-users", label: "AllUsers", icon: < GroupIcon/> },
    { to: "/library/books", label: "Books", icon: <BookIcon /> },
    { to: "/library/subscription", label: "Subscription", icon: <SubscriptionIcon /> },
    { to: "/", label: "Login", icon: <LoginIcon /> },
  ];

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#e7e7ff",
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
        <Typography variant="h5" sx={{ flexGrow: { xs: 1, sm: 0 }, textAlign: { xs: "center", sm: "left" } }}>
          Librarian Dashboard
        </Typography>

        {/* Desktop Navigation Links */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "inherit",
                  gap: 1,
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
          >
            <Link to="/library/profile" style={{ textDecoration: "none" }} onClick={handleMenuClose}>
              <Typography sx={{ p: 1, color: "inherit" }}>Profile</Typography>
            </Link>
            <Link to="/signup" style={{ textDecoration: "none" }} onClick={handleMenuClose}>
              <Typography sx={{ p: 1, color: "inherit" }}>Sign Up</Typography>
            </Link>
          </Menu>
        </Box>
      </Box>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <List>
          {navLinks.map((link) => (
            <Link
              to={link.to}
              key={link.label}
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={toggleDrawer(false)}
            >
              <ListItem button>
                <ListItemIcon>{link.icon}</ListItemIcon>
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

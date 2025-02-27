import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  Avatar,
  MenuItem,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShelfIcon from "@mui/icons-material/Store";
import BookIcon from "@mui/icons-material/Book";
import SubscriptionIcon from "@mui/icons-material/Subscriptions";
import { useDispatch, useSelector } from "react-redux";
import { userlogout } from "../../apiCalls/UserApi";
import { useAlert } from "../../custom/CustomAlert";
import { logout } from "../../reduxwork/UserSlice";
import { useMutation } from "@tanstack/react-query";


const Appbar = () => {
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
    { to: "/user/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/user/shelf", label: "Shelf", icon: <ShelfIcon /> },
    { to: "/user/books", label: "Books", icon: <BookIcon /> },
    // { to: "/user/subscription", label: "Subscription", icon: <SubscriptionIcon /> },
  ];

  // Mutation for logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const userdata = { userId: UserData.user_id._id };
      return await userlogout(userdata);
    },
    onSuccess: () => {
      dispatch(logout());
      showAlert("You have been logged out successfully", "success");
      navigate("/");
    },
    onError: (error) => {
      console.log(error.message);
      showAlert("Error logging out. Please try again later", "error");
    },
  });
  

const handleLogout = () => {
  logoutMutation.mutate();
};

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg,rgb(133, 164, 231), #292929)", // Use 'background' instead of 'bgcolor'
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
            textAlign: "left",
            fontWeight: "bold",
            textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
          }}
        >
          User Dashboard
        </Typography>

        {/* Desktop Navigation Links */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: 4,
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
            <Avatar sx={{ bgcolor: "#ff5722", color: "white" }}>
              {UserData?.user_id?.name
                ? UserData.user_id.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
                : "U"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: "#00ABE4", // Same as header background
                color: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                minWidth: 220,
                p: 1,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "#ff5722", color: "white", width: 50, height: 50 }}>
                {UserData?.user_id?.name
                  ? UserData.user_id.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                  : "U"}
              </Avatar>
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6">{UserData?.user_id.name}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {UserData?.user_id.email}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.3)" }} />
            <Link
              to="/user/profile"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={handleMenuClose}
            >
              <MenuItem sx={{ borderRadius: "8px", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } }}>
                Profile
              </MenuItem>
            </Link>
            <Link
              to=""
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={handleMenuClose}
            >
              <MenuItem 
              sx={{ borderRadius: "8px", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } }}
              onClick={handleLogout}>
                Logout
              </MenuItem>
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
            background: "#00ABE4", // Bright blue background for drawer
            color: "white",
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            background: "#00ABE4", // Same bright blue as header
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#ff5722", color: "white" }}>
              {UserData?.user_id?.name
                ? UserData.user_id.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
                : "U"}
            </Avatar>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Welcome, User!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {UserData?.user_id?.name}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={toggleDrawer(false)} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Drawer Navigation Links */}
        <List sx={{ mt: 2 }}>
          {navLinks.map((link) => (
            <Link
              to={link.to}
              key={link.label}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
              onClick={toggleDrawer(false)}
            >
              <ListItem
                button
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  mx: 1,
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>{link.icon}</ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            </Link>
          ))}
        </List>

        {/* Footer Section */}
        <Box sx={{ textAlign: "center", mt: "auto", p: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2025 Prashant Digital Library
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Appbar;

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookIcon from "@mui/icons-material/Book";
import SchoolIcon from "@mui/icons-material/School";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reduxwork/UserSlice";
import { useMutation } from "@tanstack/react-query";
import { userlogout } from "../../apiCalls/UserApi";
import { useAlert } from "../../custom/CustomAlert";

const SuperAdminAppBar = () => {
  const { showAlert } = useAlert();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { UserData } = useSelector((state) => state.user);

  const dispatch = useDispatch();
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
    { to: "/sadmin/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/sadmin/allbooks", label: "Books", icon: <BookIcon /> },
    { to: "/sadmin/addbook", label: "Add Books", icon: <AddBoxIcon /> },
    { to: "/sadmin/colleges", label: "Colleges", icon: <SchoolIcon /> },
    { to: "/sadmin/orders", label: "Orders", icon: <SubscriptionsIcon /> },
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
      {/* AppBar */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(135deg,rgb(133, 164, 231), #292929)", // Use 'background' instead of 'bgcolor'
        color: "white",
        p: 2,

      }}>
        <>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", sm: "none" }, mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SuperAdmin Dashboard
          </Typography>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 4 }}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { color: "#ffe4c4" },
                  }}
                >
                  {link.icon}
                  {link.label}
                </Typography>
              </Link>
            ))}
          </Box>

          {/* Profile Menu */}
          <IconButton onClick={handleMenu} color="inherit">
            <Avatar
              sx={{ bgcolor: "#ff5722", color: "white" }}
              alt={UserData?.user_id?.name}
            >
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
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: "#00ABE4",
                color: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                minWidth: 220,
                p: 1,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{ bgcolor: "#ff5722", color: "white", width: 50, height: 50 }}
              >
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
              to="/sadmin/profile"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={handleMenuClose}
            >
              <MenuItem
                onClick={handleMenuClose}
                sx={{ borderRadius: "8px", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } }}
              >
                Profile
              </MenuItem>
            </Link>

            <MenuItem
              onClick={handleLogout}
              sx={{ borderRadius: "8px", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } }}
            >
              Logout
            </MenuItem>
          </Menu>
        </>
      </Box>

      {/* Mobile Drawer */}
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
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            background: "#00ABE4",
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
                Welcome, SuperAdmin!
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
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={toggleDrawer(false)}
            >
              <ListItem
                button
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  mx: 1,
                  "&:hover": { background: "rgba(255, 255, 255, 0.2)" },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>{link.icon}</ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontSize: "1rem", fontWeight: 500 }}
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

export default SuperAdminAppBar;

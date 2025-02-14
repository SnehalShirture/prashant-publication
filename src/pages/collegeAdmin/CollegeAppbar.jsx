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
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import BookIcon from "@mui/icons-material/Book";
import SubscriptionIcon from "@mui/icons-material/Subscriptions";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reduxwork/UserSlice";
import { userlogout } from "../../apiCalls/UserApi";
import { useAlert } from "../../custom/CustomAlert";
import { useMutation } from "@tanstack/react-query";

const CollegeAppbar = () => {
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
    { to: "/librarydashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/library/students", label: "All Students", icon: <GroupIcon /> },
    { to: "/library/books", label: "Books", icon: <BookIcon /> },
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

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#00ABE4",
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
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 3 }}>
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} style={{ textDecoration: "none", color: "white" }}>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&:hover": {
                    color: "#ffe4c4",
                    transform: "scale(1.05)",
                    transition: "transform 0.2s ease-in-out",
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
                backgroundColor: "#fff",
                color: "#00ABE4",
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
            <Divider />
            <Link to="/library/profile" style={{ textDecoration: "none", color: "inherit" }} onClick={handleMenuClose}>
              <MenuItem sx={{ borderRadius: "8px", "&:hover": { backgroundColor: "rgba(0, 171, 228, 0.1)", transform: "scale(1.02)", transition: "0.2s ease-in-out" } }}>
                Profile
              </MenuItem>
            </Link>
            <MenuItem
              sx={{ borderRadius: "8px", "&:hover": { backgroundColor: "rgba(0, 171, 228, 0.1)", transform: "scale(1.02)", transition: "0.2s ease-in-out" } }}
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isLoading}
            >
              {logoutMutation.isLoading ? "Logging Out..." : "Logout"}
            </MenuItem>
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
            <Link to={link.to} key={link.label} style={{ textDecoration: "none", color: "inherit" }} onClick={toggleDrawer(false)}>
              <ListItem button sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)", transform: "scale(1.02)", transition: "0.2s ease-in-out" } }}>
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

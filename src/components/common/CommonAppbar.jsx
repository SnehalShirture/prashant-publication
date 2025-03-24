import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const CommonAppBar = ({ handleScroll }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Detects screen size

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { label: "HOME", section: "home" },
    { label: "ABOUT", section: "about" },
    { label: "OUR TEAM", section: "ourteam" },
    { label: "CONTACT", section: "contact" },
  ];

  return (
    <AppBar position="sticky" sx={{ background: "linear-gradient(135deg, rgb(133, 164, 231), #292929)" }}>
      <Toolbar>
        {/* Library Title */}
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Prashant Digital Library
        </Typography>

        {isMobile ? (
          <>
            {/* Mobile Menu Button */}
            <IconButton color="inherit" edge="end" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>

            {/* Mobile Drawer */}
            <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
              <List sx={{ width: 250 }}>
                {menuItems.map(({ label, section }) => (
                  <ListItem key={label} disablePadding>
                    <ListItemButton onClick={() => { handleScroll(section); toggleDrawer(); }}>
                      <ListItemText primary={label} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/login">
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Drawer>
          </>
        ) : (
          <>
            {/* Desktop Navigation Tabs */}
            <Tabs textColor="inherit" indicatorColor="secondary">
              {menuItems.map(({ label, section }) => (
                <Tab key={label} label={label} onClick={() => handleScroll(section)} />
              ))}
            </Tabs>

            {/* Login Button */}
            <Button color="inherit" component={Link} to="/login" sx={{ marginLeft: 2 }}>
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CommonAppBar;

import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const CommonAppBar = () => {
  return (
    <AppBar position="sticky" sx={{
      background: "linear-gradient(135deg,rgb(133, 164, 231), #292929)",
    }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          Prashant Digital Library
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CommonAppBar;

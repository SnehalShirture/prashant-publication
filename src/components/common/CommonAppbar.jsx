import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const CommonAppBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          Digital Library
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CommonAppBar;

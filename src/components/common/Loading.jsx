import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const Loading = ({ message = "Loading...", size = 50 }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress size={size} color="primary" />
      <Typography mt={2} variant="h6" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
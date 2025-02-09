import React, { useState } from "react";
import { Button, Typography, Container } from "@mui/material";
import { useSelector } from "react-redux";

const LibrarySubscription = () => {
  const { UserData } = useSelector((state) => state.user);
  console.log("Userdata : " , UserData.user_id._id )
  const userId = UserData.user_id._id 

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight={550} sx={{ mb: 2 }}>
        Selected Books for Subscription
      </Typography>
    </Container>
  );
};

export default LibrarySubscription;
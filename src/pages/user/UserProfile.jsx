import React from "react";
import { Avatar, Box, Button, Paper, Typography, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../reduxwork/UserSlice";
import { userlogout } from "../../apiCalls/userApi";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access user data from Redux store
  const { UserData, islogin } = useSelector((state) => state.user);

  console.log(UserData)
  console.log(islogin)
  const handleLogout = async () => {
    try {
      let userdata = {
        userId: UserData
      }
      const res = await userlogout(userdata);
      console.log(res)
      dispatch(logout());
      navigate("/");

    } catch (error) {
      console.log(error.message)

    }
  }

  if (!islogin || !UserData) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          No user data available. Please log in..
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* User Header Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>

          <Grid item xs={12} sm={8} md={9}>
            <Typography variant="h5" fontWeight="bold">
              Username: {UserData.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Email: {UserData.email}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Phone: {UserData.mobile}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Role: {UserData.role}
            </Typography>


            <Button
              variant="outlined"
              color="primary"
              size="small"
              sx={{ mt: 2, mr: 2 }}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfile;

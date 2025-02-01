import React, { useState } from "react";
import { Avatar, Box, Button, Paper, Typography, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../reduxwork/UserSlice";
import { userlogout } from "../../apiCalls/UserApi";
import { useAlert } from "../../custom/CustomAlert";
import UpdatePasswordModal from "../../custom/UpdatePassword"; 

const CAdminProfile = () => {
  const { showAlert } = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { UserData, islogin } = useSelector((state) => state.user);
  const [updatePasswordModalOpen, setUpdatePasswordModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      let userdata = {
        userId: UserData.user_id._id,
      };
      const res = await userlogout(userdata);
      console.log(res);
      dispatch(logout());
      showAlert("You have been logged out successfully", "success");
      navigate("/");
    } catch (error) {
      console.log(error.message);
      showAlert("Error while logging out. Please try again", "error");
    }
  };

  if (!islogin || !UserData) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          No user data available. Please log in.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* User Header Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Avatar Section */}
          <Grid item xs={12} sm={4} md={3} sx={{ textAlign: "center" }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: "3rem",
                bgcolor: "#00ABE4",
                color: "white",
                margin: "0 auto",
              }}
            >
              {UserData.user_id.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </Avatar>
          </Grid>

          {/* User Details Section */}
          <Grid item xs={12} sm={8} md={9}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {UserData.user_id.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <strong>Email:</strong> {UserData.user_id.email}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <strong>Phone:</strong> {UserData.user_id.mobile}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <strong>Role:</strong> {UserData.user_id.role}
            </Typography>

            {/* Buttons Section */}
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mr: 2, textTransform: "none" }}
                onClick={() => setUpdatePasswordModalOpen(true)}
              >
                Update Password
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ textTransform: "none" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Update Password Modal */}
      <UpdatePasswordModal
        open={updatePasswordModalOpen}
        onClose={() => setUpdatePasswordModalOpen(false)}
        email={UserData.user_id.email}
      />
    </Box>
  );
};

export default CAdminProfile;
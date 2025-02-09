import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../apiCalls/UserApi";
import { useAlert } from "../../custom/CustomAlert";


const StyledContainer = styled(Container)(() => ({
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  marginTop: "50px",
}));

const ResetPassword = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation(); // To get the passed email from navigation
  const { email } = location.state || {}; // Get the email passed through navigation
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Redirect if no email is passed from the previous page
  useEffect(() => {
    if (!email) {
      showAlert("No email provided. Please start the password reset flow again." , "error");
      navigate("/");
    }
  }, [email, navigate]);

  // Use TanStack React Query's useMutation hook
  const { mutate: handleResetPassword, isLoading } = useMutation({
    mutationFn: (data) => resetPassword(data),
    onSuccess: () => {
      showAlert("Password reset successfully! Redirecting to login.", "success");
      navigate("/");
    },
    onError: (error) => {
      console.error("Failed to reset password:", error.message);
      showAlert("Failed to reset password. Please try again.", "error");
    },
  });

  const handleSubmit = () => {
    const data = { email, otp, newPassword };
    handleResetPassword(data); // Trigger mutation
  };

  return (
    <StyledContainer maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: 3, textAlign: "center" }}
        >
          Reset Password
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Enter the OTP sent to your email and set a new password.
        </Typography>

        {/* Email Field (Read-only) */}
        <TextField
          required
          label="Email Address"
          fullWidth
          variant="outlined"
          value={email || ""}
          disabled
          sx={{ mb: 3 }}
        />

        {/* OTP Field */}
        <TextField
          required
          label="OTP"
          fullWidth
          variant="outlined"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* New Password Field */}
        <TextField
          required
          label="New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading} // Disable button during loading
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </Box>
    </StyledContainer>
  );
};

export default ResetPassword;

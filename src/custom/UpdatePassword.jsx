import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import eye icons
import { updatePassword } from "../apiCalls/UserApi";
import { useAlert } from "../custom/CustomAlert";

const UpdatePasswordModal = ({ open, onClose, email }) => {
  const { showAlert } = useAlert();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State to manage password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check for mobile view
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      showAlert("New password and confirm password do not match.", "error");
      return;
    }

    try {
      const response = await updatePassword(email, oldPassword, newPassword);
      showAlert(response.message, "success");
      onClose(); // Close the modal after successful update
    } catch (error) {
      showAlert(error.message || "Failed to update password.", "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile} // Full-screen on mobile
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          color: "black",
          textAlign: "center",
          fontSize: isMobile ? "1.5rem" : "1.75rem",
          fontWeight: "bold",
          padding: isMobile ? "16px" : "24px",
        }}
      >
        Update Password
      </DialogTitle>
      <DialogContent
        sx={{
          padding: isMobile ? "16px" : "24px",
        }}
      >
        <Box sx={{ mt: 2 }}>
          {/* Old Password Field */}
          <TextField
            fullWidth
            label="Old Password"
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ mb: 2 }}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* New Password Field */}
          <TextField
            fullWidth
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirm New Password Field */}
          <TextField
            fullWidth
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          padding: isMobile ? "16px" : "24px",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
          size={isMobile ? "small" : "medium"}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          size={isMobile ? "small" : "medium"}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePasswordModal;
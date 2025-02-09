import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginuser, sendotp } from "../../apiCalls/UserApi";
import { useDispatch } from "react-redux";
import { login } from "../../reduxwork/UserSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAlert } from "../../custom/CustomAlert";

const StyledContainer = styled(Container)(() => ({
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  background: "#fff",
}));

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Login = () => {
  const { showAlert } = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // React Query Mutations
  const loginMutation = useMutation({
    mutationFn: loginuser,
    onSuccess: (response) => {
      const user = response.data.session;
      const userRole = user.user_id.role;

      dispatch(
        login({
          ...response.data.session,
          token: response.data.token,
        })
      );

      if (userRole === "CollegeAdmin") {
        navigate("/librarydashboard");
      } else if (userRole === "user") {
        navigate("/user/dashboard");
      } else if (userRole === "SuperAdmin") {
        navigate("/sadmin/dashboard");
      } else {
        navigate("/profile");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error.message);
      showAlert("Error: " + error.message, "error");
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: sendotp,
    onSuccess: (res) => {
      console.log(res);
      showAlert("OTP sent successfully to your email!", "success");
      navigate("/resetpassword", { state: { email } });
    },
    onError: (error) => {
      console.error("Failed to send OTP:", error.message);
      showAlert("Failed to send OTP. Please try again.", "error");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = new FormData(e.target);
    const reqData = Object.fromEntries(loginData);
    loginMutation.mutate(reqData);
  };

  const handleSendOtp = () => {
    sendOtpMutation.mutate({ email });
  };

  return (
    <StyledContainer maxWidth="sm">
      <Box
        sx={{
          padding: "10px",
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
            color: "#00ABE4",
          }}
        >
          Welcome Back 🙏!!!
        </Typography>

        <Typography variant="body1" align="center" sx={{ marginBottom: 4 }}>
          Log in to access your account and continue exploring our library.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            onChange={handleChange}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{
                      color: "#00ABE4",
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="primary"
            disabled={loginMutation.isLoading}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            {loginMutation.isLoading ? "Logging In..." : "Log In"}
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            mt: 2,
          }}
        >
          <Button
            variant="text"
            color="primary"
            onClick={() => setIsModalOpen(true)}
            sx={{ fontWeight: "bold" }}
          >
            Forgot Password
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate("/signup")}
            sx={{ fontWeight: "bold" }}
          >
            Don't have an account? Sign Up
          </Button>
        </Box>
      </Box>

      {/* Forgot Password Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isModalOpen}>
          <Box sx={modalStyle}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ mb: 2, fontWeight: "bold", color: "#00ABE4" }}
            >
              Forgot Password
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Enter your Registered Email to receive OTP
            </Typography>
            <TextField
              required
              label="Email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              onClick={handleSendOtp}
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: "8px",
              }}
            >
              Send OTP
            </Button>
          </Box>
        </Fade>
      </Modal>
    </StyledContainer>
  );
};

export default Login;
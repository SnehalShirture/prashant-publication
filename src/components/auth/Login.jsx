import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Modal,
  Fade,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginuser, sendotp } from "../../apiCalls/UserApi";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../reduxwork/UserSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAlert } from "../../custom/CustomAlert";

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

  let { UserData, islogin } = useSelector((state) => state.user)
  const userRole = UserData?.user_id?.role;
  console.log("islogin : " ,islogin)

  const { showAlert } = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      showAlert("Error: " + error.message, "error");
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: sendotp,
    onSuccess: () => {
      showAlert("OTP sent successfully to your email!", "success");
      navigate("/resetpassword", { state: { email } });
    },
    onError: () => {
      showAlert("Failed to send OTP. Please try again.", "error");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleSendOtp = () => {
    sendOtpMutation.mutate({ email });
  };

  return (
    <>
          <Grid container justifyContent="center" alignItems="center" sx={{ background: "#f3f4f6", padding: 3 }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", padding: 3 }}>
                <CardContent>
                  <Box textAlign="center" mb={3}>
                    <Typography variant="h4" fontWeight="bold" color="#1d4ed8">
                      Welcome Back!
                    </Typography>
                    <Typography variant="body1" mt={1} color="textSecondary">
                      Log in to access your account.
                    </Typography>
                  </Box>
  
                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
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
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3, borderRadius: "8px", py: 1.5 }}
                    >
                      Log In
                    </Button>
                  </Box>
  
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button color="primary" onClick={() => setIsModalOpen(true)}>
                      Forgot Password?
                    </Button>
                    <Button color="primary" onClick={() => navigate("/signup")}>
                      Sign Up
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
  
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <Fade in={isModalOpen}>
                <Box sx={modalStyle}>
                  <Typography variant="h6" mb={2} color="#1d4ed8">
                    Forgot Password
                  </Typography>
                  <TextField
                    required
                    label="Email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                  />
                  <Button fullWidth variant="contained" onClick={handleSendOtp} sx={{ mt: 2 }}>
                    Send OTP
                  </Button>
                </Box>
              </Fade>
            </Modal>
          </Grid>
       
    </>
  );
  
  }


export default Login;

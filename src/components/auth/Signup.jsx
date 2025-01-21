import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Link, Grid2, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { styled } from '@mui/system';
import { registeruser } from '../../apiCalls/UserApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../reduxwork/UserSlice';

const StyledContainer = styled(Container)(() => ({
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
}));

const SignUp = () => {
  const dispatch = useDispatch()
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    role: 'user' // default role is 'user'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerData = new FormData(e.target);
    const reqData = Object.fromEntries(registerData);
    console.log('Form Submitted:', reqData);

    try {
      const response = await registeruser(reqData);
      console.log(response);
      alert('User Registered Successfully');
      dispatch(register(response));
      nav('/');
    } catch (error) {
      if (error.response) {
        console.error('Server Error:', error.response.data);
        alert('Error: ' + error.response.data.message);
      } else if (error.request) {
        console.error('Network Error:', error.request);
        alert('Network Error: Please check your internet connection.');
      } else {
        console.error('Error:', error.message);
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          Create an Account
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center" sx={{ marginBottom: 4 }}>
          Join our digital library to explore a world of knowledge and resources.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="name"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid2>

            <Grid2 item xs={12}>
              <TextField
                required
                fullWidth
                id="mobile"
                label="Mobile No."
                name="mobile"
                autoComplete="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </Grid2>

            <Grid2 item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid2>

            {/* Radio buttons for role selection */}
            <Grid2 item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Select Role</FormLabel>
                <RadioGroup
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel value="SuperAdmin" control={<Radio />} label="SuperAdmin" />
                  <FormControlLabel value="CollegeAdmin" control={<Radio />} label="CollegeAdmin" />
                  <FormControlLabel value="user" control={<Radio />} label="user" />
                </RadioGroup>
              </FormControl>
            </Grid2>
          </Grid2>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
          >
            Sign Up
          </Button>
          <Grid2 container justifyContent="flex-end">
            <Grid2 item>
              <Link href="/login" variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Already have an account? Log in
              </Link>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default SignUp;

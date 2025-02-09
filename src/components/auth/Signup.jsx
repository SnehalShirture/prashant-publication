import React, { useState } from 'react';
import { TextField,
   Button,
   Box, 
   Typography, 
   Container, 
   Link, 
   Grid, 
   Radio, 
   RadioGroup, 
   FormControlLabel, 
   FormControl, 
   FormLabel } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { registeruser } from '../../apiCalls/UserApi';
import { register } from '../../reduxwork/UserSlice';
import { useAlert } from '../../custom/CustomAlert';

const StyledContainer = styled(Container)(() => ({
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
}));

const SignUp = () => {
  const { showAlert } = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    role: 'user'
  });

  const registerMutation = useMutation({
    mutationFn: registeruser,
    onSuccess: (response) => {
      showAlert('User Registered Successfully', 'success');
      dispatch(register(response));
      navigate('/');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      showAlert('Error in Registration: ' + errorMessage, 'error');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <StyledContainer maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          Create an Account
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center" sx={{ marginBottom: 4 }}>
          Join our digital library to explore a world of knowledge and resources.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="First Name" name="name" value={formData.name} onChange={handleChange} autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth label="Mobile No." name="mobile" value={formData.mobile} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth label="Email Address" name="email" value={formData.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth type="password" label="Password" name="password" value={formData.password} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Select Role</FormLabel>
                <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
                  <FormControlLabel value="SuperAdmin" control={<Radio />} label="SuperAdmin" />
                  <FormControlLabel value="CollegeAdmin" control={<Radio />} label="CollegeAdmin" />
                  <FormControlLabel value="user" control={<Radio />} label="User" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="outlined" color="primary" sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}>
            {registerMutation.isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Already have an account? Log in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default SignUp;

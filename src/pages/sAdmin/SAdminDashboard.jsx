import React, { useMemo } from 'react';
import { Container, Grid, Card, CardContent, Typography, Tabs, Tab, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { LibraryBooks, AttachMoney, MenuBook } from '@mui/icons-material';
import { getBooks } from '../../apiCalls/BooksApi';
import { userlogout } from '../../apiCalls/UserApi';
import { logout } from '../../reduxwork/UserSlice';

const SAdminDashboard = () => {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const { UserData } = useSelector((state) => state.user);

  // Book API Call
  const { data: bookData } = useQuery('books', getBooks);
  const Books = bookData?.filter((book) => book.publisher === 'Digital Library') || [];
  const OtherBooks = bookData?.filter((book) => book.publisher === 'other') || [];

  const BooksCounter = Books.length;
  const OtherBooksCounter = OtherBooks.length;

  const dashboardData = [
    { title: 'Our Publication', value: BooksCounter, icon: <LibraryBooks fontSize="large" /> },
    { title: 'Other Publications', value: OtherBooksCounter, icon: <MenuBook fontSize="large" /> },
  ];

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = async () => {
      try {
        let userdata = {
          userId: UserData
        }
        const response = await userlogout(userdata);
        console.log(response)
        dispatch(logout());
        navigate("/");
  
      } catch (error) {
        console.log(error.message)
  
      }
    }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Hi Welcome, <span>{UserData.name} {UserData.lastName}</span>
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Dashboard" />
          <Tab label="Add Books" onClick={() => navigate('/add_books')} />
          <Tab label="All Books" onClick={() => navigate('/all_books')} />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {dashboardData.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <Typography variant="h4">{item.value}</Typography>
                        <Typography variant="subtitle1">{item.title}</Typography>
                      </div>
                      {item.icon}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default SAdminDashboard;


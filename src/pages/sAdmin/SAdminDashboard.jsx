// import React, { useMemo } from 'react';
// import { Container, Grid, Card, CardContent, Typography, Tabs, Tab, Box, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { useQuery } from 'react-query';
// import { LibraryBooks, MenuBook } from '@mui/icons-material';
// import { getBooks } from '../../apiCalls/BooksApi';
// import { userlogout } from '../../apiCalls/UserApi';
// import { logout } from '../../reduxwork/UserSlice';

// const SAdminDashboard = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { UserData } = useSelector((state) => state.user);

//     // Book API Call
//     const { data: bookData } = useQuery('books', getBooks);

//     // Safely process bookData
//     const Books = useMemo(() => {
//         if (Array.isArray(bookData)) {
//             return bookData.filter((book) => book.publisher === 'Digital Library');
//         }
//         return [];
//     }, [bookData]);

//     const OtherBooks = useMemo(() => {
//         if (Array.isArray(bookData)) {
//             return bookData.filter((book) => book.publisher === 'other');
//         }
//         return [];
//     }, [bookData]);

//     const BooksCounter = Books.length;
//     const OtherBooksCounter = OtherBooks.length;

//     const dashboardData = [
//         { title: 'Our Publication', value: BooksCounter, icon: <LibraryBooks fontSize="large" /> },
//         { title: 'Other Publications', value: OtherBooksCounter, icon: <MenuBook fontSize="large" /> },
//     ];

//     const [tabValue, setTabValue] = React.useState(0);

//     const handleTabChange = (event, newValue) => {
//         setTabValue(newValue);
//     };

//     const handleLogout = async () => {
//         try {
//             const userdata = {
//                 userId: UserData,
//             };
//             const response = await userlogout(userdata);
//             console.log(response);
//             dispatch(logout());
//             navigate('/');
//         } catch (error) {
//             console.error('Logout error:', error.message);
//         }
//     };

//     return (
//         <Container>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Typography variant="h5">
//                     Hi Welcome, <span>{UserData?.name} {UserData?.lastName}</span>
//                 </Typography>
//                 <Button variant="contained" color="secondary" onClick={handleLogout}>
//                     Logout
//                 </Button>
//             </Box>

//             <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
//                 <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
//                     <Tab label="Dashboard" />
//                     <Tab label="Add Books" onClick={() => navigate('/add_books')} />
//                     <Tab label="All Books" onClick={() => navigate('/all_books')} />
//                 </Tabs>
//             </Box>

//             {tabValue === 0 && (
//                 <Grid container spacing={3}>
//                     {dashboardData.map((item, index) => (
//                         <Grid item xs={12} sm={6} md={4} key={index}>
//                             <Card>
//                                 <CardContent
//                                     style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
//                                 >
//                                     <div>
//                                         <Typography variant="h4">{item.value}</Typography>
//                                         <Typography variant="subtitle1">{item.title}</Typography>
//                                     </div>
//                                     {item.icon}
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     ))}
//                 </Grid>
//             )}
//         </Container>
//     );
// };

// export default SAdminDashboard;

import React from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import { Book, AttachMoney, LibraryBooks } from "@mui/icons-material";

const SAdminDashboard = () => {
  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Welcome Message */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Welcome, Admin!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's an overview of your dashboard.
        </Typography>
      </Box>

      {/* Dashboard Cards */}
      <Grid container spacing={3}>
        {/* Our Publications */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "#3f51b5", mr: 2 }}>
              <Book />
            </Avatar>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Our Publications
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                1,245
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Other Publications */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "#ff9800", mr: 2 }}>
              <LibraryBooks />
            </Avatar>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Other Publications
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                980
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Revenue */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "#4caf50", mr: 2 }}>
              <AttachMoney />
            </Avatar>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                $150,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SAdminDashboard;

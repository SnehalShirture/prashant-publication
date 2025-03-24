// import React, { useEffect, useState } from 'react';
// import { Box, Grid, Typography, Paper, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
// import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
// import Groups2Icon from '@mui/icons-material/Groups2';
// import ReceiptIcon from '@mui/icons-material/Receipt';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// import CustomTable from '../../custom/CustomTable';
// import { useSelector } from 'react-redux';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { fetchAllPackages , createRazorpayOrder } from '../../apiCalls/PackageApi';
// import { createsubscription } from '../../apiCalls/SubscriptionApi';
// import { useAlert } from '../../custom/CustomAlert';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import { closeSnackbar } from 'notistack';

// const steps = ['Choose Readers', 'Confirm Payment'];

// const LibraryAdminDashboard = () => {
//     const { showAlert } = useAlert();
//     const { UserData } = useSelector((state) => state.user);

//     // Fetch packages
//     const { data: packagedata = [] } = useQuery({
//         queryKey: ['packagedata.data'],
//         queryFn: fetchAllPackages,
//     });

//     // State for stepper
//     const [activeStep, setActiveStep] = useState(0);
//     const [selectedPackages, setSelectedPackages] = useState([]);
//     const [openModal, setOpenModal] = useState(false);
//     const [selectedReaders, setSelectedReaders] = useState(5);
//     const [createdSubscriptionId, setCreatedSubscriptionId] = useState(null); // Store subscriptionId

//     const readerPrices = { 5: 2000, 10: 2500, 15: 3000, 20: 3500 };

//     // Calculate total price dynamically
//     const totalPrice = 6000 + readerPrices[selectedReaders] * selectedPackages.length;


//     //create razorpay payment
//     const loadRazorpayScript = async () => {
//         if (window.Razorpay) {
//             return true; // Razorpay is already loaded
//         }
//         return new Promise((resolve) => {
//           const script = document.createElement('script');
//           script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//           script.onload = () => resolve(true);
//           script.onerror = () => resolve(false);
//           document.body.appendChild(script);
//         });
//       };
//       const handlePayment = async () => {

//         if (!createdSubscriptionId) {
//             showAlert("Subscription not created. Please try again.", "error");
//             return;
//         }
//         const isLoaded = await loadRazorpayScript();
//         if (!isLoaded) {
//             showAlert("Failed to load Razorpay. Check your internet connection.", "error");
//             return;
//         }
//         try {
//             // Log payload before API call
//             console.log("Creating Razorpay order with:", { amount: totalPrice, currency: 'INR' });
//             const paymentData = {
//                 collegeId: UserData.user_id.collegeId,
//                 totalAmount: totalPrice,
//                 subscriptionId: createdSubscriptionId
//             };
//             console.log("Razorpay order response:", paymentData);


//             const response = await createRazorpayOrder(paymentData);
//             console.log(" response : " , response.data)

//             const razorpayOrder  = response.data
//             console.log("razorpayOrder :" , razorpayOrder)

//             const options = {
//                 key: 'rzp_test_DN13BsXBiCnLZy', // Ensure this is your correct Razorpay Test Key
//                 amount: razorpayOrder.amount,
//                 currency: razorpayOrder.currency,
//                 name: 'Library Subscription',
//                 description: 'Subscription Payment',
//                 order_id: razorpayOrder.id,
//                 handler: async (paymentResponse) => {
//                     console.log("Payment response:", paymentResponse);
//                     showAlert('Payment Successful!', 'success');
//                     setOpenModal(false); // Close modal after payment
//                     setActiveStep(0); // Reset stepper
//                     setSelectedPackages([]); // Clear selections
//                     setSelectedReaders(5);
//                     setCreatedSubscriptionId(null); // Reset subscriptionId
//                     },
//                 prefill: {
//                     name: UserData.user_id.name,
//                     email: UserData.user_id.email,
//                     contact: UserData.user_id.mobile,
//                 },
//                 theme: { color: '#3399cc' },
//             };

//             const paymentGateway = new window.Razorpay(options);
//             paymentGateway.open();
//         } catch (error) {
//             console.error("Payment Error:", error.message);
//             showAlert('Payment Failed! ' + error.message, 'error');
//         }
//     };


//     // Stepper handlers
//     const handleNext = async () => {
//         if (activeStep === 0) {
//             // Create Subscription first before proceeding to payment
//             try {
//                 const subscribedBooks = selectedPackages.flatMap(pkg => pkg.booksIncluded || []);

//                 const subscriptionData = {
//                     collegeId: UserData.user_id.collegeId,
//                     package: selectedPackages.map(pkg => pkg._id),
//                     totalAmount: totalPrice,
//                     maxReaders: selectedReaders,
//                     subscribedBooks,
//                 };

//                 const res = await createsubscription(subscriptionData);
//                 console.log(" res : " , res )
//                 console.log(" subscription id  : " , res.data._id)

//                 if (res?.data?._id)
//                      {
//                     setCreatedSubscriptionId(res.data._id); // Store subscriptionId for payment
//                     console.log("Subscription created successfully:", res.data);
//                     setActiveStep(1); // Move to next step after success
//                 } else {
//                     showAlert("Failed to create subscription", "error");
//                 }
//             } catch (error) {
//                 console.error("Subscription Error:", error);
//                 showAlert("Error creating subscription: " + error.message, "error");
//             }
//         } else {
//             setActiveStep((prev) => prev + 1);
//         }
//     };

//     const handleBack = () => {
//         setActiveStep((prev) => prev - 1);
//     };

//     const dashboardData = [
//         { title: 'Total Books', value: 1200, icon: <LibraryBooksIcon fontSize='large' />, color: '#3f51b5' },
//         { title: 'Total Students', value: 350, icon: <Groups2Icon fontSize='large' />, color: '#4caf50' },
//         { title: 'Recent Activities', value: 25, icon: <ReceiptIcon fontSize='large' />, color: '#ff9800' },
//         { title: 'Total Revenue', value: '$15,000', icon: <MonetizationOnIcon fontSize='large' />, color: '#f44336' },
//     ];
//     return (
//         <Box sx={{ padding: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
//             <Typography variant='h4' gutterBottom>
//                 Welcome, <strong>{UserData.user_id.name}</strong>
//             </Typography>

//                {/* Dashboard Summary Cards */}
//                <Grid container spacing={4} sx={{ marginTop: 2 }}>
//                 {dashboardData.map((item, index) => (
//                     <Grid item xs={12} sm={6} md={3} key={index}>
//                         <Paper
//                             elevation={4}
//                             sx={{
//                                 padding: 3,
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 alignItems: 'center',
//                                 bgcolor: item.color,
//                                 color: '#fff',
//                                 borderRadius: 2,
//                             }}
//                         >
//                             <Avatar sx={{ bgcolor: '#fff', color: item.color, mb: 2, width: 56, height: 56 }}>
//                                 {item.icon}
//                             </Avatar>
//                             <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
//                                 {item.value}
//                             </Typography>
//                             <Typography variant='body1'>{item.title}</Typography>
//                         </Paper>
//                     </Grid>
//                 ))}
//             </Grid>

//             {/* Package Table */}
//             <Box sx={{ marginTop: 5 }}>
//                 <Typography variant='h5' gutterBottom>
//                     Subscription Packages
//                 </Typography>
//                 <CustomTable
//                     data={packagedata?.data || []}
//                     columns={[
//                         { header: 'Sr. No', accessorFn: (row, index) => index + 1 },
//                         { header: 'Category', accessorFn: (row) => row.category },
//                         { header: 'Academic Year', accessorFn: (row) => row.academicYear },
//                         { header: 'Books Included', accessorFn: (row) => row.booksIncluded?.length || 0 },
//                     ]}
//                     enableSelection={true}
//                     onSelectedBooksChange={setSelectedPackages}
//                 />

//                 {selectedPackages.length > 0 && (
//                     <Box sx={{ textAlign: 'right', marginTop: 2 }}>
//                         <Button variant='contained' color='primary' onClick={() => setOpenModal(true)}>
//                             Continue
//                         </Button>
//                     </Box>
//                 )}
//             </Box>

//             {/* Modal with Stepper */}
//             <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
//                 <DialogTitle>Subscription Process</DialogTitle>
//                 <DialogContent>
//                     <Stepper activeStep={activeStep}>
//                         {steps.map((label) => (
//                             <Step key={label}>
//                                 <StepLabel>{label}</StepLabel>
//                             </Step>
//                         ))}
//                     </Stepper>

//                     {/* Step Content */}
//                     {activeStep === 0 && (
//                         <Box sx={{ marginTop: 2 }}>
//                             {selectedPackages.map((pkg, index) => (
//                                 <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
//                                     <Typography><strong>Category:</strong> {pkg.category}</Typography>
//                                     <Typography><strong>Academic Year:</strong> {pkg.academicYear}</Typography>
//                                     <Typography><strong>Books Included:</strong> {pkg.booksIncluded?.length || 0}</Typography>
//                                 </Paper>
//                             ))}
//                              <FormControl fullWidth sx={{ marginTop: 2 }}>
//                             <InputLabel>Number of Readers</InputLabel>
//                             <Select value={selectedReaders} onChange={(e) => setSelectedReaders(e.target.value)}>
//                                 {[5, 10, 15, 20].map((num) => (
//                                     <MenuItem key={num} value={num}>{num}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                         <Typography>
//                             <strong>Maintenance  Cost:</strong> :  ₹ 6000 
//                         </Typography>

//                         <Typography variant="h6" sx={{ marginTop: 2 }}>
//                             Total Price: ₹{totalPrice}
//                         </Typography>
//                         </Box>
//                     )}

//                     {activeStep === 1 && (
//                         <Box sx={{ marginTop: 2 }}>
//                             <Typography variant="h6" sx={{ marginBottom: 2 }}>
//                                number of selected packages : {selectedPackages.length}
//                             </Typography>
//                             <Typography variant="h6" sx={{ marginBottom: 2 }}>
//                               Total Readers : {selectedReaders}
//                             </Typography>
//                             <Typography variant="h6" sx={{ marginTop: 2 }}>
//                             Total Price: ₹{totalPrice}
//                             </Typography>

//                         </Box>

//                     )}

//                 </DialogContent>

//                 <DialogActions>
//                     <Button onClick={() => setOpenModal(false)} color="secondary">Close</Button>
//                     {activeStep === 0 && 
//                     <Button variant="contained" color="primary" onClick={handleNext}>
//                         Next</Button>}
//                     {activeStep === 1 &&
//                     <Button variant="contained" color="primary" onClick={handlePayment}>
//                     Proceed Payment</Button>}
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default LibraryAdminDashboard;


import React, { useEffect, useState } from 'react';
import {
    Box, Grid, IconButton, Badge, Typography, Paper, Avatar, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select,
    FormControl, InputLabel, Stepper, Step, StepLabel
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Groups2Icon from '@mui/icons-material/Groups2';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CustomTable from '../../custom/CustomTable';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPackages } from '../../apiCalls/PackageApi';
import { createsubscription, getNotifications } from '../../apiCalls/SubscriptionApi';
import { useAlert } from '../../custom/CustomAlert';
import { getBooks } from '../../apiCalls/BooksApi';

const steps = ['Select Reference Books', 'Choose Readers and Create Subscription'];

const LibraryAdminDashboard = () => {
    const { showAlert } = useAlert();
    const { UserData } = useSelector((state) => state.user);
    const token = UserData.token;

    const { data: packagedata = [] } = useQuery({ queryKey: ['packagedata'], queryFn: fetchAllPackages });
    const { data: notifications = [] } = useQuery({ queryKey: ['notifications'], queryFn: () => getNotifications({ collegeId: UserData?.user_id?.collegeId }) });


    const packegeprice = packagedata?.data || [];
    const finalPrice = packegeprice?.prices?.[0]?.Price || 0
    console.log("finalPrice ", finalPrice)
    const { data: allBooks } = useQuery({
        queryKey: ["allBooks"],
        queryFn: getBooks
    });
    const referenceBooks = allBooks?.data?.filter(book => book.type === 'reference') || []; // Ensure safe access


    const [activeStep, setActiveStep] = useState(0);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [selectedReferenceBooks, setSelectedReferenceBooks] = useState([]);
    const [selectedReaders, setSelectedReaders] = useState(5);
    const [openModal, setOpenModal] = useState(false);

    const readerPrices = { 5: finalPrice, 10: Number(finalPrice + 500), 15: Number(finalPrice + 1000), 20: Number(finalPrice + 1500) };
    const maintanenceCost = 6000;

    // Extract prices from selected packages
    const selectedPackagePrices = selectedPackages.reduce((sum, pkg) => {
        return sum + (pkg.prices?.[0]?.Price || 0);
    }, 0);

    // Calculate the total discounted price for selected reference books (70% off)
    const referenceBooksDiscountedPrice = selectedReferenceBooks.reduce((sum, book) => {
        const bookPrice = book.price || 0;  // access to book price
        return sum + Math.round(bookPrice * 0.3); // 70% discount means paying only 30%
    }, 0);
    console.log("Discounted Reference Books Price: ₹", referenceBooksDiscountedPrice); // Debugging console log


    console.log("referenceBooks : ", referenceBooks)


    const totalPrice = Math.round(maintanenceCost + selectedPackagePrices + readerPrices[selectedReaders] * selectedPackages.length + referenceBooksDiscountedPrice);

    const handleNext = async () => {
        if (activeStep === 0) {
            setActiveStep(1);
        } else {
            try {
                const subscribedBooks = selectedPackages.flatMap(pkg => pkg.booksIncluded || []);
                const subscriptionData = {
                    collegeId: UserData?.user_id?.collegeId,
                    package: selectedPackages.map(pkg => pkg._id),
                    totalAmount: totalPrice,
                    maxReaders: selectedReaders,
                    maintenanceCost: maintanenceCost,
                    subscribedBooks: [...subscribedBooks, ...selectedReferenceBooks],
                };

                const res = await createsubscription({ subscriptionData, token });
                if (res?.data?._id) {
                    showAlert("Subscription created successfully!", 'success');
                    setOpenModal(false);
                    setActiveStep(0);
                    setSelectedPackages([]);
                    setSelectedReaders(5);
                    setSelectedReferenceBooks([]);
                } else {
                    showAlert("Failed to create subscription", "error");
                }
            } catch (error) {
                console.error("Subscription Error:", error);
                showAlert("Error creating subscription: " + error.message, "error");
            }
        }
    };

    const dashboardData = [
        { title: 'Total Books', value: 1200, icon: <LibraryBooksIcon fontSize='large' />, color: '#3f51b5' },
        { title: 'Total Students', value: 350, icon: <Groups2Icon fontSize='large' />, color: '#4caf50' },
        { title: 'Recent Activities', value: 25, icon: <ReceiptIcon fontSize='large' />, color: '#ff9800' },
        { title: 'Total Revenue', value: '$15,000', icon: <MonetizationOnIcon fontSize='large' />, color: '#f44336' },
    ];



    return (
        <Box sx={{ padding: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant='h4' gutterBottom>
                Welcome, <strong>{UserData.user_id.name}</strong>
            </Typography>
            <Box>
                <IconButton color="primary">
                    <Badge badgeContent={notifications.length} color="secondary">
                        <Typography variant="body2" color="inherit">
                            {/* {notifications.length > 0 ? ${notifications.length} New Notifications : ""} */}
                        </Typography>
                    </Badge>
                </IconButton>
            </Box>

            {/* Dashboard Summary Cards */}
            <Grid container spacing={4} sx={{ marginTop: 2 }}>
                {dashboardData.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            elevation={4}
                            sx={{
                                padding: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: item.color,
                                color: '#fff',
                                borderRadius: 2,
                            }}
                        >
                            <Avatar sx={{ bgcolor: '#fff', color: item.color, mb: 2, width: 56, height: 56 }}>
                                {item.icon}
                            </Avatar>
                            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                {item.value}
                            </Typography>
                            <Typography variant='body1'>{item.title}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>


            <Box sx={{ marginTop: 5 }}>
                <Typography variant='h5' gutterBottom>Subscription Packages</Typography>
                <CustomTable
                    data={packagedata?.data || []}
                    columns={[
                        { header: 'Sr. No', size: 50, accessorFn: (row, index) => index + 1 },
                        { header: 'Category', size: 50, accessorFn: (row) => row.category },
                        { header: 'Academic Year', size: 50, accessorFn: (row) => row.academicYear },
                        { header: 'Books Included', size: 50, accessorFn: (row) => row.booksIncluded?.length || 0 },
                        { header: 'Price', size: 50, accessorFn: (row) => row.prices?.[0]?.Price },
                    ]}
                    enableSelection={true}
                    onSelectedBooksChange={setSelectedPackages}
                />
                {selectedPackages.length > 0 && (
                    <Button variant='contained' color='primary' onClick={() => setOpenModal(true)}>Continue</Button>
                )}
            </Box>

            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
                <DialogTitle>Create Subscription</DialogTitle>
                <DialogContent>
                    {/* Stepper */}
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ marginBottom: 3 }}>
                        {steps.map((label, index) => (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === 0 && (
                        <>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Select Reference Books (70% Discount Applied)
                            </Typography>
                            <CustomTable
                                data={referenceBooks} // Use referenceBooks directly
                                columns={[{ header: 'Book Name', accessorFn: row => row.name }]}
                                enableSelection={true}
                                onSelectedBooksChange={setSelectedReferenceBooks}
                            />
                        </>
                    )}

                    {activeStep === 1 && (
                        <>
                            <FormControl fullWidth sx={{ marginTop: 2 }}>
                                <InputLabel>Number of Readers</InputLabel>
                                <Select value={selectedReaders} onChange={(e) => setSelectedReaders(e.target.value)}>
                                    {[5, 10, 15, 20].map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
                                </Select>
                            </FormControl>

                            {/* Price Breakdown */}
                            <Box sx={{ marginTop: 3 }}>
                                <Typography variant="h6">Price Breakdown:</Typography>
                                <Typography><strong>Maintenance Cost:</strong> ₹{maintanenceCost}</Typography>
                                <Typography><strong>Reference Books Total Price (Before Discount):</strong> ₹{selectedReferenceBooks.reduce((sum, book) => sum + (Number(book.price) || 0), 0)}</Typography>
                                <Typography><strong>Reference Books Price After 70% Discount:</strong> ₹{referenceBooksDiscountedPrice}</Typography>
                                <Typography variant="h6" sx={{ marginTop: 2, color: 'green' }}>
                                    Total Price: ₹{totalPrice}
                                </Typography>
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="secondary">Close</Button>
                    <Button variant="contained" color="primary" onClick={handleNext}>
                        {activeStep === 0 ? "Next" : "Create Subscription"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LibraryAdminDashboard;



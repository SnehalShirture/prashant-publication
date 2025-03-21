import React, { useState, useEffect } from "react";
import {Grid,AccordionSummary, AccordionDetails, Box, Tabs, Tab,Modal, Typography, Container, Button, IconButton, Card, CardContent, CardHeader,Chip,  Accordion, Divider } from "@mui/material";
import CustomTable from "../../custom/CustomTable";
import { getBooks, fetchBooksByCollegeId , stopBookReadingCounter } from "../../apiCalls/BooksApi";
import { createsubscription, getSubscriptionByClgId } from "../../apiCalls/SubscriptionApi";
import { fetchCurrentReaders } from "../../apiCalls/UserApi";
import { useSelector } from "react-redux";
import { useAlert } from "../../custom/CustomAlert";
import { useQuery, useMutation } from "@tanstack/react-query";
import PDFReader from "../../components/common/PDFReader";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";


const categories = ["All", "Science", "Commerce", "Arts"];

const Collegebooks = () => {
  const { showAlert } = useAlert();
  const [tabValue, setTabValue] = useState(0);
  const [categoryTab, setCategoryTab] = useState(0);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openReadersModal, setOpenReadersModal] = useState(false);
  const [currentReaders, setCurrentReaders] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { UserData } = useSelector((state) => state.user);
  const collegeId = UserData.user_id.collegeId;
  const token = UserData.token;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCategoryChange = (event, newValue) => {
    setCategoryTab(newValue);
  };

  const { data: bookData = [] } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks
  });

  const { data: subscribedBooks = [] } = useQuery({
    queryKey: ["subscribedBooks"],
    queryFn: () => fetchBooksByCollegeId({ collegeId, token })
  });

  const TotalAmount = selectedBooks.reduce((acc, book) => acc + (Number(book.price) || 0), 0);

  const subscriptionMutation = useMutation({
    mutationFn: async () => {
      const subscriptionData = {
        collegeId: collegeId,
        subscribedBooks: selectedBooks.map((book) => book._id),
        totalAmount: TotalAmount,
      };
      return await createsubscription(subscriptionData);
    },
    onSuccess: () => {
      showAlert("You have successfully subscribed to the selected books.", "success");
    },
    onError: (error) => {
      showAlert("Failed to create subscription: " + error.message, "error");
    },
  });

  const { data: subscriptionData = [] } = useQuery({
    queryKey: ["subscriptionData"],
    queryFn: () => getSubscriptionByClgId({ collegeId, token }),
  });
  console.log("subscriptionData : ", subscriptionData)


  // Fetch Current Readers
    const { data: readersData = [] } = useQuery( useQuery({
      queryKey: ["currentReaders", collegeId],
      queryFn: () => fetchCurrentReaders(collegeId)
      }));
  
  
    const handleFetchReaders = (studentEmail) => {
      const studentReaders = readersData.find((reader) => reader.email === studentEmail);
      setCurrentReaders(studentReaders ? studentReaders.users : []);
      setOpenReadersModal(true);
    };
  
    // Stop Reading Session
    const stopReadingMutation = useMutation({
        mutatatioFn:  stopBookReadingCounter, 
        onSuccess: () => {
        showAlert("Student has been stopped from reading.", "success");
        queryClient.invalidateQueries(["currentReaders", collegeId]);
      },
    });
  
    const handleStopReading = (studentId) => {
      stopReadingMutation.mutate({ studentId, collegeId });
    };
  const columns = [
    { header: "Sr. No", accessorFn: (row, index) => index + 1 },
    { header: "Title", accessorKey: "name" },
    { header: "Author", accessorKey: "author" },
    { header: "Category", accessorKey: "category" },
    { header: "Price", accessorKey: "price" },
    { header: "Publisher", accessorKey: "publisher" },
    { header: "Year Published", accessorKey: "yearPublished" },
  ];

  const subscribedColumns = [
    ...columns,
    {
      header: "Action",
      accessorFn: (row) =>
        row.bookPdf ? (
          <IconButton color="primary" onClick={() => setSelectedBook(row)}>
            <OpenInNewIcon />
          </IconButton>
        ) : null,
    },
    {
      header: "Readers",
      Cell: ({ row }) => (
        <Button variant="contained" onClick={() => handleFetchReaders(row.original._id)}>
          See Readers
        </Button>
      ),
    },
  ];

  const filteredBooks =
    categoryTab === 0 ? bookData.data : bookData.data.filter((book) => book.category === categories[categoryTab]);

    const renderStatusChip = (status) => {
      return status === "Active" ? (
        <Chip icon={<CheckCircleIcon />} label="Active" color="success" />
      ) : (
        <Chip icon={<CancelIcon />} label="Inactive" color="error" />
      );
    };
    
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={550} sx={{ mb: 2 }}>
        Books & Subscriptions
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="book tabs"
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab label="All Books" />
        <Tab label="Subscribed Books" />
        <Tab label="All Orders" />
      </Tabs>

      {tabValue === 0 && (
        <Tabs
          value={categoryTab}
          onChange={handleCategoryChange}
          aria-label="category tabs"
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          {categories.map((category, index) => (
            <Tab key={category} label={category} />
          ))}
        </Tabs>
      )}

      <Box>
        {tabValue === 0 && (
          <CustomTable
            data={filteredBooks}
            columns={columns}
            enableSelection={true}
            onSelectedBooksChange={setSelectedBooks}
          />
        )}
        {tabValue === 1 && (
          <CustomTable data={subscribedBooks.data} columns={subscribedColumns} />
        )}
        {tabValue === 2 && (
         <Box sx={{ mt: 2 }}>
         {subscriptionData?.data?.map((order, index) => (
           <Card key={order._id} sx={{ mb: 2, p: 2, borderRadius: 2, boxShadow: 3 }}>
             <CardHeader
               title={
                 <Typography variant="h6" fontWeight={600}>
                   {/* <ShoppingCartIcon sx={{ mr: 1, color: "primary.main" }} /> */}
                   Order #{index + 1}
                 </Typography>
               }
               subheader={renderStatusChip(order.isActive ? "Active" : "Inactive")}
             />
             <CardContent>
               <Grid container spacing={2}>
                 
                {
                  order.isActive  && (
                    <>
                    <Grid item xs={6}>
                      <Typography>
                     <CalendarTodayIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                     <strong>Start Date:</strong> {new Date(order.startDate).toLocaleDateString()}
                   </Typography>
                   </Grid>
                   <Grid item xs={6}>
                   <Typography>
                     <CalendarTodayIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                     <strong>End Date:</strong> {new Date(order.endDate).toLocaleDateString()}
                   </Typography>
                 </Grid>
                    </>
                  )}
                 <Grid item xs={6}>
                   <Typography>
                     <LibraryBooksIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                     <strong>Total Books:</strong> {order.totalBooks}
                   </Typography>
                 </Grid>
                 <Grid item xs={6}>
                   <Typography>
                     <CurrencyRupeeIcon sx={{ verticalAlign: "middle", mr: 1, color: "success.main" }} />
                     <strong>Total Amount:</strong> ₹{order.totalAmount}
                   </Typography>
                 </Grid>
                 <Grid item xs={12}>
                   <Accordion>
                     <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "grey.100" }}>
                       <Typography fontWeight={600}>Books in this Order</Typography>
                     </AccordionSummary>
                     <AccordionDetails>
                       {order.books?.map((book) => (
                         <Typography key={book._id} sx={{ mb: 1 }}>
                           - {book.name} by {book.author} ({book.category})
                         </Typography>
                       ))}
                     </AccordionDetails>
                   </Accordion>
                 </Grid>
               </Grid>
             </CardContent>
           </Card>
         ))}
       </Box>
        )}

      </Box>

      {/* Current Readers Modal */}
      <Modal open={openReadersModal} onClose={() => setOpenReadersModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", p: 4 }}>
          <Typography variant="h6">Current Readers</Typography>
          <CustomTable
            data={currentReaders}
            columns={[
              { accessorKey: "name", header: "Reader Name" },
              {
                header: "Actions",
                Cell: ({ row }) => (
                  <Button variant="contained" onClick={() => handleStopReading(row.original._id)}>
                    Stop Reading
                  </Button>
                ),
              },
            ]}
          />
        </Box>
      </Modal>

      {/* PDF Reader Modal */}
      {selectedBook && (
        <PDFReader
          fileUrl={`http://localhost:5000/${selectedBook.bookPdf}`}
          sessionId={UserData._id}
          onClose={() => {
            setSelectedBook(null);
          }}
        />
      )}
    </Container>
  );
};

export default Collegebooks;

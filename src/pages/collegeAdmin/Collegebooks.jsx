import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Container, Button, IconButton } from "@mui/material";
import CustomTable from "../../custom/CustomTable";
import { getBooks, fetchBooksByCollegeId } from "../../apiCalls/BooksApi";
import { createsubscription } from "../../apiCalls/SubscriptionApi";
import { useSelector } from "react-redux";
import { useAlert } from "../../custom/CustomAlert";
import { useQuery, useMutation } from "@tanstack/react-query";
import PDFReader from "../../components/common/PDFReader";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";


const categories = ["All", "Science", "Commerce", "Arts"];

const Collegebooks = () => {
  const { showAlert } = useAlert();
  const [tabValue, setTabValue] = useState(0);
  const [categoryTab, setCategoryTab] = useState(0);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);


  const { UserData } = useSelector((state) => state.user);
  const collegeId = UserData.user_id.collegeId;

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
  console.log(" bookData :", bookData)

  const { data: subscribedBooks = [] } = useQuery({
    queryKey: ["subscribedBooks"],
    queryFn: () => fetchBooksByCollegeId({ collegeId })
  });

  console.log("subscribedBooks  :", subscribedBooks)
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
      accessorFn: (row) => (
        row.bookPdf ? (
          <IconButton color="primary" onClick={() => setSelectedBook(row)}>
            <OpenInNewIcon />
          </IconButton>
        ) : null
      ),
    },
  ];

  const filteredBooks =
    categoryTab === 0 ? bookData.data : bookData.data.filter((book) => book.category === categories[categoryTab]);

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
        {tabValue === 0 && <CustomTable data={filteredBooks} columns={columns} enableSelection={true} onSelectedBooksChange={setSelectedBooks} />}
        {tabValue === 1 && <CustomTable data={subscribedBooks.data} columns={subscribedColumns} />}
        {tabValue === 2 && <Typography>college orders</Typography>}
      </Box>

      {tabValue === 0 && selectedBooks.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Total Amount: Rs. {TotalAmount}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => subscriptionMutation.mutate()}
            sx={{ mt: 1 }}
          >
            Subscribe to Selected Books
          </Button>
        </Box>
      )}
      {selectedBook && (
        <PDFReader
          fileUrl={`http://localhost:5000/${selectedBook.bookPdf}`}
          sessionId={UserData._id}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </Container>
  );
};

export default Collegebooks;



import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Container, Button, IconButton, Card, CardContent, CardHeader, Divider } from "@mui/material";
import CustomTable from "../../custom/CustomTable";
import { getBooks, fetchBooksByCollegeId } from "../../apiCalls/BooksApi";
import { createsubscription, getSubscriptionByClgId } from "../../apiCalls/SubscriptionApi";
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

  const { data: subscribedBooks = [] } = useQuery({
    queryKey: ["subscribedBooks"],
    queryFn: () => fetchBooksByCollegeId({ collegeId })
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
    queryFn: () => getSubscriptionByClgId({ collegeId }),
  });
  console.log("subscriptionData : ", subscriptionData)

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
          <Box>
            {subscriptionData?.data?.map((order, index) => (
              <Card key={order._id} sx={{ mb: 2 }}>
                <CardHeader title={`Order #${index + 1}`} subheader={`Status: ${order.status}`} />
                <CardContent>
                  <Typography><strong>College Name:</strong> {order.college[0]?.clgName || "N/A"}</Typography>
                  <Typography><strong>College Address:</strong> {order.college[0]?.clgAddress || "N/A"}</Typography>
                  <Typography><strong>College Stream:</strong> {order.college[0]?.clgStream || "N/A"}</Typography>
                  <Typography><strong>Director Name:</strong> {order.college[0]?.directorName || "N/A"}</Typography>
                  <Typography><strong>Librarian Name:</strong> {order.college[0]?.librarianName || "N/A"}</Typography>
                  <Typography><strong>Librarian Mobile:</strong> {order.college[0]?.librarianMobile || "N/A"}</Typography>
                  <Typography><strong>Librarian Email:</strong> {order.college[0]?.librarianEmail || "N/A"}</Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography><strong>Total Books:</strong> {order.totalBooks}</Typography>
                  <Typography><strong>Total Amount (₹):</strong> {order.totalAmount}</Typography>
                  <Typography><strong>Max Readers:</strong> {order.maxReaders}</Typography>
                  <Typography><strong>Start Date:</strong> {new Date(order.startDate).toLocaleDateString()}</Typography>
                  <Typography><strong>End Date:</strong> {new Date(order.endDate).toLocaleDateString()}</Typography>
                  <Typography><strong>Is Active:</strong> {order.isActive ? "Yes" : "No"}</Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="h6"><strong>Books:</strong></Typography>
                  {order.books?.map((book) => (
                    <Typography key={book._id}>
                      - {book.name} by {book.author} (Category: {book.category})
                    </Typography>
                  ))}

                  <Divider sx={{ my: 1 }} />
                  <Typography varient="h6"> <strong>- Acadamic Year : </strong> </Typography>
                  {order.books?.map((pkg) => (
                    <Typography key={pkg._id}>
                      {pkg.academicYear}&nbsp;
                     ({pkg.category})
                      
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

      </Box>

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

import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Container, Tooltip, Button } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import CustomTable from "../../custom/CustomTable";
import { getBooks } from "../../apiCalls/BooksApi";
import { createsubscription } from "../../apiCalls/SubscriptionApi";
import { useSelector } from "react-redux";
import { useAlert } from "../../custom/CustomAlert";
import { useQuery, useMutation } from "@tanstack/react-query";

const Collegebooks = () => {
  const { showAlert } = useAlert();
  const [tabValue, setTabValue] = useState(0);
  const [selectedBooks, setSelectedBooks] = useState([]);
  
  const { UserData } = useSelector((state) => state.user);
  console.log("collegeId : ", UserData.user_id.collegeId)
  const collegeId = UserData.user_id.collegeId;
  const categories = ["All", "Science", "Commerce", "Arts", "Engineering"];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { data: bookData = [], error } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  useEffect(() => {
    console.log("Selected Books:", selectedBooks);
  }, [selectedBooks]);

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
    onSuccess: (response) => {
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
    // {
    //   header: "Details",
    //   accessorFn: (row) => row,
    //   Cell: ({ cell }) => (
    //     <Tooltip title="Details">
    //       <a
    //         href={`http://localhost:5000/${cell.getValue().bookPdf}`}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <EastIcon fontSize="small" />
    //       </a>
    //     </Tooltip>
    //   ),
    // },
  ];

  if (error) return <Typography>Error fetching books</Typography>;

  const filteredBooks =
    tabValue === 0 ? bookData.data : bookData.data.filter((book) => book.category === categories[tabValue]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={550} sx={{ mb: 2 }}>
        All Books
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="book categories"
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        {categories.map((category, index) => (
          <Tab key={category} label={category} />
        ))}
      </Tabs>

      <Box>
        <CustomTable
          data={filteredBooks}
          columns={columns}
          enableSelection={true}
          onSelectedBooksChange={setSelectedBooks}
        />
      </Box>

      {selectedBooks.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Total Amount: Rs. {TotalAmount}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => subscriptionMutation.mutate()}
            sx={{ mt: 1 }}
            disabled={subscriptionMutation.isLoading}
          >
            {subscriptionMutation.isLoading ? "Processing..." : "Subscribe to Selected Books"}
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Collegebooks;

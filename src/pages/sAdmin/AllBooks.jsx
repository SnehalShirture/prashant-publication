import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Container, IconButton, Tooltip } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import AddIcon from "@mui/icons-material/Add";
import CustomTable from "../../custom/CustomTable";
import { getBooks, deleteBook } from "../../apiCalls/BooksApi"; // Import your API methods
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useAlert } from "../../custom/CustomAlert";


const AllBooks = () => {
  const { showAlert } = useAlert()
  const [tabValue, setTabValue] = useState(0);
  const [openAddBook, setOpenAddBook] = useState(false); // State to toggle AddBook modal
  const [bookData, setBookData] = useState([]); // State to store books data

  // List of categories
  const categories = ["All", "Science", "Commerce", "Arts", "Engineering"];

  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open Add Book modal
  const handleOpenAddBook = () => {
    setOpenAddBook(true);
  };

  // Close Add Book modal
  const handleCloseAddBook = () => {
    setOpenAddBook(false);
  };

  // Fetch books from the API
  const fetchBooks = async () => {
    try {
      const response = await getBooks(); // Fetch data from the API
      console.log("API Response:", response); // Debug log to inspect the response
      setBookData(response.data); // Update the bookData state with the fetched data
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // UseEffect to fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // delete book api call
  const handleDeleteBook = async (_id) => {
    try {
      const response = await deleteBook({ _id: _id }); 
      console.log("Book deleted successfully:", response); 
      setBookData(bookData.filter((book) => book._id !== _id)); 
      showAlert("Book deleted successfully" , "success");
    } catch (error) {
      console.error("Error deleting book:", error.message);
      showAlert("Error deleting book", "error");
    }
  };
  
  // Table columns
  const columns = [
    { header: "Sr. No", accessorFn: (row, index) => index + 1 },
    { header: "Title", accessorKey: "name" },
    { header: "Author", accessorKey: "author" },
    { header: "Category", accessorKey: "category" },
    { header: "Price", accessorKey: "price" },
    { header: "Publisher", accessorKey: "publisher" },
    { header: "Year Published", accessorKey: "yearPublished" },
    { header: "Book Path", accessorKey: "bookPdf" },
    {
      header: "Actions",
      accessorFn: (row) => row,
      Cell: ({ cell }) => (
        <Box>
          <Tooltip title="Details">
          <a
            href={`http://localhost:5000/${cell.getValue().bookPdf}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <EastIcon fontSize="small" />
          </a>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            onClick={() => handleDeleteBook(cell.getValue()._id)} // Pass the correct `id` to handleDeleteBook
            color="error"
          >
            <DeleteForeverIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        </Box>
        

      ),
    },

  ];

  // Filter books based on selected category
  const filteredBooks =
    tabValue === 0
      ? bookData
      : bookData.filter((book) => book.category === categories[tabValue]);

  console.log("Filtered Books:", filteredBooks); // Debug filtered books

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={550} sx={{ mb: 2 }}>
        All Books
      </Typography>



      {/* Tabs for categories */}
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
        <CustomTable data={filteredBooks} columns={columns} />
      </Box>
    </Container>
  );
};

export default AllBooks;

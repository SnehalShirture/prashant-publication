import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { fetchShelfBooks } from "../../apiCalls/BooksApi";
import { useSelector } from "react-redux";
import PDFReader from "../../components/common/PDFReader";

const Shelf = () => {
  const { UserData } = useSelector((state) => state.user);
  const user_id = UserData.user_id._id;

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBook, setSelectedBook] = useState(null); // State for selected book

  // Fetch books on component 
  useEffect(() => {
    const fetchBooks = async () => {
      const user = {
        _id: user_id,
      };
      try {
        const response = await fetchShelfBooks(user);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error.message);
      }
    };

    if (user_id) fetchBooks();
  }, [user_id]);

  // Filter books based on search query (global) and category
  const filteredBooks = books.filter((book) => {
    return (
      (book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory ? book.category === selectedCategory : true)
    );
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Box
      sx={{
        margin: 0,
        flexGrow: 1,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f9f9f9", // Light background color for the entire container
        padding: "20px",
      }}
    >
      {/* Search and Filter Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          padding: "10px 20px",
          borderRadius: "10px",
          backgroundColor: "#E4F1FD", // Light blue filter background
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          alignItems: "center",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name, author, or category"
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Arts">Arts</MenuItem>
            <MenuItem value="Commerce">Commerce</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Book Grid Section */}
      <Grid container spacing={3} sx={{ marginTop: "20px" }}>
        {filteredBooks.map((book, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                maxWidth: 345,
                height: "100%", 
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:5000/${book.coverImage}`}
                alt={book.name}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {book.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Author:</strong> {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Category:</strong> {book.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Price:</strong> ${book.price}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, width: "100%" }}
                  onClick={() => setSelectedBook(book)}
                >
                  View PDF
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* PDF Reader Modal */}
      {selectedBook && (
        <PDFReader
          fileUrl={`http://localhost:5000/${selectedBook.bookPdf}`}
          sessionId={UserData._id}
          onClose={() => setSelectedBook(null)} // Close the modal
        />
      )}
    </Box>
  );
};

export default Shelf;

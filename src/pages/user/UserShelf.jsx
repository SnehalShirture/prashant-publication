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

  // Fetch books on component mount
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

  // Filter books based on search query (author) and category
  const filteredBooks = books.filter((book) => {
    return (
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) &&
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
    <Box sx={{ padding: 3 }}>
      {/* Search and Filter Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          label="Search Author"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: "60%" }}
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
      <Grid container spacing={3}>
        {filteredBooks.map((book, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={book.coverImage}
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
                  sx={{ mt: 2 }}
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
          fileUrl={`http://localhost:5000/${selectedBook.bookPdf}`} // Replace with your actual backend URL for PDFs
          sessionId={UserData._id}
          onClose={() => setSelectedBook(null)} // Close the modal
        />
      )}
    </Box>
  );
};

export default Shelf;

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Pagination,
} from "@mui/material";
import { getBooks, addToShelf } from "../../apiCalls/BooksApi";
import PDFReader from "./PDFReader";
import { useDispatch, useSelector } from "react-redux";
import { addShelf } from "../../reduxwork/ShelfSlice"; // Import addShelf action

const RecommendedBooks = () => {
  const dispatch = useDispatch();
  const { UserData } = useSelector((state) => state.user);
  const { shelves } = useSelector((state) => state.shelf); // Access shelves from Redux state

  const userid = UserData.user_id._id;
  const sessionId = UserData._id;
  const token = UserData.token;

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesQuery = book.author
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? book.category === selectedCategory
      : true;
    return matchesQuery && matchesCategory;
  });

  const paginatedBooks = filteredBooks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle Add to Shelf (Redux + API)
  const handleAddToShelf = async (book) => {
    // Check if the book is already in the shelf
    const isAlreadyAdded = shelves.some((shelf) => shelf.bookId === book._id);
    if (isAlreadyAdded) {
      alert(`${book.name} is already in your shelf.`);
      return;
    }

    try {
      // Add to server-side shelf
      const data = {
        bookId: book._id,
        userId: userid,
      };
      const shelfRes = await addToShelf(data, token);

      // Dispatch Redux action to add the book locally
      dispatch(addShelf({ bookId: book._id, name: book.name }));

      console.log("Add to shelf response:", shelfRes);
      alert(`${book.name} has been added to your shelf!`);
    } catch (error) {
      console.error("Error adding book to shelf:", error.message);
      alert(error.response?.data?.message || "Failed to add book to shelf.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Filters Section */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: 3, gap: 2 }}
      >
        <TextField
          label="Search Author"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
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

      {/* Books List */}
      <Grid container spacing={3}>
        {paginatedBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={book.coverImage}
                alt={book.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
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
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => setSelectedBook(book)}
                >
                  View PDF
                </Button>
                <Button size="small" onClick={() => handleAddToShelf(book)}>
                  Add to Shelf
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Section */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredBooks.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </Box>

      {/* PDF Reader Modal */}
      {selectedBook && (
        <PDFReader
          fileUrl={`http://localhost:5000/${selectedBook.bookPdf}`}
          sessionId={sessionId}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </Box>
  );
};

export default RecommendedBooks;

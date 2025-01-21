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
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getBooks } from "../../apiCalls/BooksApi";
import PDFReader from "./PDFReader";
import { useSelector } from "react-redux";

const RecommendedBooks = () => {
  const { UserData } = useSelector((state) => state.user);
  const sessionId = UserData._id;

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
        console.log(response.data)
        console.log(response.data.coverImage)
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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Filters Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, gap: 2 }}>
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
                <FavoriteBorderIcon style={{ color: "red" }} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Section */}
      {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredBooks.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </Box> */}

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

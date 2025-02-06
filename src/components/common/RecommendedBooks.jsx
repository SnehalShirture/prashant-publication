import React, { useState } from "react";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { getBooks, addToShelf } from "../../apiCalls/BooksApi";
import PDFReader from "./PDFReader";
import { useDispatch, useSelector } from "react-redux";
import { addShelf } from "../../reduxwork/ShelfSlice";
import { useAlert } from "../../custom/CustomAlert";

const RecommendedBooks = () => { 
  const { showAlert } = useAlert();
  const dispatch = useDispatch();
  const { UserData } = useSelector((state) => state.user);

  const userid = UserData.user_id._id;
  const sessionId = UserData._id;
  const token = UserData.token;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const itemsPerPage = 4;

  const primaryColor = "#4A90E2";
  const backgroundColor = "#F9FAFB";
  const cardBackground = "#FFFFFF";
  const buttonColor = "#F37A24";

  // Correct usage of useQuery in v5 with default value for books
  const { data: books = [], isLoading, isError, error } = useQuery({
    queryKey: ["books.data"],
    queryFn: getBooks,
    onError: (error) => {
      console.error("Error fetching books:", error);
      showAlert("Failed to fetch books.", "error");
    }
  });

  // books data 
  console.log("Books data: ", books.data);

  // Ensure books is an array before calling .filter
  const filteredBooks = Array.isArray(books.data)
    ? books.data.filter((book) => {
        const matchesQuery = searchQuery
          ? [book.name, book.author, book.category]
              .join(" ")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : true;
        const matchesCategory = selectedCategory
          ? book.category === selectedCategory
          : true;
        return matchesQuery && matchesCategory;
      })
    : [];

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

  // React Query: Add to Shelf Mutation
  const addToShelfMutation = useMutation({
    mutationFn: (book) => {
      const data = {
        bookId: book._id,
        userId: userid,
      };
      return addToShelf(data, token);
    },
    onSuccess: (response, book) => {
      dispatch(addShelf({ bookId: book._id, name: book.name }));
      showAlert(`${book.name} has been added to your shelf!`, "success");
    },
    onError: (error) => {
      showAlert(error.response?.data?.message || "Failed to add book to shelf.", "error");
    }
  });

  const handleAddToShelf = (book) => {
    addToShelfMutation.mutate(book);
  };

  return (
    <Box
      sx={{
        margin: 0,
        flexGrow: 1,
        bgcolor: backgroundColor,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Filters Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: "#E4F1FD",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by book name, author, or category"
          sx={{
            flex: 1,
            bgcolor: "#FFFFFF",
            borderRadius: 1,
          }}
        />
        <FormControl sx={{ minWidth: 200, bgcolor: "#FFFFFF", borderRadius: 1 }}>
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

      {/* Loading and Error States */}
      {isLoading && <Typography variant="h6">Loading books...</Typography>}
      {isError && <Typography variant="h6" color="error">{error.message || "Failed to fetch books"}</Typography>}

      {/* Books List */}
      <Grid container spacing={3}>
        {paginatedBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
            <Card
              sx={{
                maxWidth: 345,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: cardBackground,
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:5000/${book.coverImage}`}
                alt={book.name}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{ color: primaryColor }}
                >
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
                  sx={{ bgcolor: buttonColor, "&:hover": { bgcolor: "#d8681c" } }}
                  onClick={() => setSelectedBook(book)}
                >
                  View PDF
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    color: primaryColor,
                    borderColor: primaryColor,
                    "&:hover": {
                      bgcolor: primaryColor,
                      color: "#FFFFFF",
                    },
                  }}
                  onClick={() => handleAddToShelf(book)}
                >
                  Add to Shelf
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Section */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
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

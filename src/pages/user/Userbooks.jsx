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
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchBooksForUser, addToShelf, startBookReadingCounter, stopBookReadingCounter } from "../../apiCalls/BooksApi";
import { useDispatch, useSelector } from "react-redux";
import { addShelf } from "../../reduxwork/ShelfSlice";
import { useAlert } from "../../custom/CustomAlert";
import PDFReader from "../../components/common/PDFReader";

const UserBooks = () => {
  const { showAlert } = useAlert();
  const dispatch = useDispatch();
  const { UserData } = useSelector((state) => state.user);

  const userId = UserData.user_id._id;
  const token = UserData.token;
  const collegeId = UserData?.user_id?.collegeId;

  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8; // Adjusted for better layout

  const BookTypes = ["All", "textbook", "reference"]
  const BookCategories = ["All", "arts", "science", "commerce"]


  const { data: userBooks = [] } = useQuery({
    queryKey: ["userBooks.data", collegeId , token],
    queryFn: () => fetchBooksForUser({ collegeId , token }),
  });

  const booksData = userBooks?.data?.[0]?.books || [];
  console.log(" booksData : ", booksData)


  // Filtering Books
  const filteredBooks = booksData.filter((book) => {
    const matchesQuery = searchQuery
      ? [book.name, book.author, book.category]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
    const matchesType = selectedType ? book.type === selectedType : true;
    return matchesQuery && matchesCategory && matchesType;
  });


  // Pagination Logic
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice(
    (page - 1) * itemsPerPage,
    Math.min(page * itemsPerPage, filteredBooks.length)
  );

  // books add to shelf
  const addToShelfMutation = useMutation({
    mutationFn: (book) => {
      const data = {
        bookId: book._id,
        userId: userId,
      };
      return addToShelf(data, token);
    },
    onSuccess: (response, book) => {
      dispatch(addShelf({ bookId: book._id, name: book.name }));
      showAlert(`${book.name} has been added to your shelf!`, "success");
    },
    onError: (error) => {
      showAlert(error.response?.data?.message || "Failed to add book to shelf.", "error");
    },
  });
  const handleAddToShelf = (book) => {
    addToShelfMutation.mutate(book);
  };

  const handleStartBookReadingCounter = (book) => {
    startBookReadingCounterMutation.mutate(book);
  };

  const startBookReadingCounterMutation = useMutation({
    mutationFn: (book) => {
      const data = {
        bookId: book._id,
        collegeId: collegeId,
      };
      return startBookReadingCounter(data);
    },
    onSuccess: (response, book) => {
      showAlert(`${book.name} has been started reading!`, "success");
      setSelectedBook(book);
    },
    onError: (error) => {
      showAlert(error.response?.data?.message || "Failed to start book reading!", "error");
    },
  });

  const handleStopBookReadingCounter = (book) => {
    if (book) {
      stopBookReadingCounterMutation.mutate(book);
    }
  };

  const stopBookReadingCounterMutation = useMutation({
    mutationFn: (book) => {
      const data = {
        bookId: book._id,
        collegeId: collegeId,
      };
      return stopBookReadingCounter(data);
    },
    onSuccess: (response, book) => {
      showAlert(`${book.name} has been stopped reading!`, "success");
      setSelectedBook(null);
    },
    onError: (error) => {
      showAlert(error.response?.data?.message || "Failed to stop book reading!", "error");
    },
  });

  return (
    <Box sx={{ flexGrow: 1, minHeight: "80vh", p: 3, bgcolor: "#F9FAFB" }}>
      {/* Search & Filter */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, backgroundColor: "#E4F1FD", p: 2, borderRadius: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, author, or category"
          sx={{ flexGrow: 1 }}
        />
        {/* form control for select category */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {BookCategories.filter((category) => category !== "All").map((category, index) => (
              <MenuItem key={index} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* form control for select types of books */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {BookTypes.filter((type) => type !== "All").map((type, index) => (
              <MenuItem key={index} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Book Grid */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {paginatedBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
            <Card
              sx={{
                height: 400,
                display: "flex",
                flexDirection: "column",
                boxShadow: 5,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "scale(1.05)", boxShadow: 8 },
                borderRadius: 3,
              }}
            >
              <CardMedia component="img" height="220" image={`http://localhost:5000/${book.coverImage}`} alt={book.name} />
              <CardContent>
                <Typography gutterBottom variant="h6" sx={{ color: "#4A90E2" }}>{book.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Author:</strong> {book.author}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button size="small" variant="contained" sx={{ bgcolor: "#F37A24" }} onClick={() => handleStartBookReadingCounter(book)}>
                  View PDF
                </Button>
                <Button size="small" variant="outlined" color="primary" onClick={() => handleAddToShelf(book)}>
                  Add to Shelf
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} color="primary" />
        </Box>
      )}

      {/* PDF Reader Modal */}
      {selectedBook && (
        <PDFReader
          fileUrl={`http://localhost:5000/${selectedBook.bookPdf}`}
          sessionId={UserData._id}
          onClose={() => {
            if (selectedBook) handleStopBookReadingCounter(selectedBook);
            setSelectedBook(null);
          }}
        />
      )}
    </Box>
  );
};

export default UserBooks;

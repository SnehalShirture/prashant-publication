import React, { useState } from "react";
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
import { useQuery, useMutation , useQueryClient } from "@tanstack/react-query";
import { fetchShelfBooks, bookRemoveFromShelf ,startBookReadingCounter, stopBookReadingCounter } from "../../apiCalls/BooksApi";
import { useDispatch, useSelector } from "react-redux";
import PDFReader from "../../components/common/PDFReader";
import { useAlert } from "../../custom/CustomAlert";
import { removeShelf } from "../../reduxwork/ShelfSlice"

const Shelf = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); 
  const { showAlert } = useAlert();
  const { UserData } = useSelector((state) => state.user);
  const userId = UserData.user_id._id;
  const collegeId = UserData?.user_id?.collegeId;
  const token = UserData.token;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const { data: books = [] } = useQuery({
    queryKey: ["shelfBooks", userId],
    queryFn: async () => {
      const user = { _id: userId };
      const response = await fetchShelfBooks(user, token);
      return response.data;
    },
  });

  //delete book from shelf
  const { mutate: deleteBook} = useMutation({
    mutationFn: (book) => {
      const data = { 
        userId : userId , 
        bookId  : book._id
      };
      console.log("data : " , data)
      return bookRemoveFromShelf(data, token);
    },
    onSuccess: (book) => {
      dispatch(removeShelf(book._id))
      showAlert("Book successfully deleted from shelf!", "success");
      queryClient.invalidateQueries(["shelfBooks", userId]); // Refresh the book list
    },
    onError: (error) => {
      console.log(
        "Error deleting book from shelf:",
        error.message
      )
      showAlert(error.response?.data?.message || "Failed to delete book!", "error");
    },
  });

  const handleDeleteBook = (book) => {
    deleteBook(book);
  };


  const filteredBooks = books.filter((book) =>
    (book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory ? book.category === selectedCategory : true)
  );

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

  const handleStartBookReadingCounter = (book) => {
    startBookReadingCounterMutation.mutate(book);
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

  const handleStopBookReadingCounter = (book) => {
    if (book) {
      stopBookReadingCounterMutation.mutate(book);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "80vh", backgroundColor: "#f9f9f9", p: 3 }}>
      {/* Search & Filter */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          backgroundColor: "#E4F1FD",
          p: 2,
          borderRadius: 2,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, author, or category"
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="science">Science</MenuItem>
            <MenuItem value="arts">Arts</MenuItem>
            <MenuItem value="commerce">Commerce</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Book Grid */}
       {/* Empty Shelf Message */}
       {filteredBooks.length === 0 ? (
        <Box  sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh", // Adjust height to center within viewport
          textAlign: "center",
        }}>
          <Typography variant="h6" color="text.secondary">
            📚 Your shelf is empty!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {filteredBooks.map((book, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  height: 450,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 5,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 8 },
                  borderRadius: 3,
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000/${book.coverImage}`}
                  alt={book.name}
                  sx={{ objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#333" }}>
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
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        bgcolor: "#F37A24",
                        mt: 2,
                        fontWeight: "bold",
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#d96520" },
                      }}
                      onClick={() => setSelectedBook(book)}
                    >
                      View PDF
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ mt: 1, fontWeight: "bold", borderRadius: 2 }}
                      onClick={() => handleDeleteBook(book)}
                    >
                      Delete from Shelf
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* PDF Reader Modal */}
      {selectedBook && (
        <PDFReader
          fileUrl={`http://localhost:5000/${selectedBook.bookPdf}`}
          sessionId={UserData._id}
          onClose={() => {
            if (selectedBook) {
              handleStopBookReadingCounter(selectedBook);
            }
            setSelectedBook(null);
          }}
        />
      )}
    </Box>
  );
};

export default Shelf;

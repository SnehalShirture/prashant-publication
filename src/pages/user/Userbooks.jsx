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
import { fetchBooksByCollegeId, addToShelf, startBookReadingCounter, stopBookReadingCounter } from "../../apiCalls/BooksApi";
import { useDispatch, useSelector } from "react-redux";
import { addShelf } from "../../reduxwork/ShelfSlice";
import { useAlert } from "../../custom/CustomAlert";
import PDFReader from "../../components/common/PDFReader";

const UserBooks = () => {
  const { showAlert } = useAlert();
  const dispatch = useDispatch();
  const { UserData } = useSelector((state) => state.user);
  console.log("UserData : ", UserData)

  const userid = UserData.user_id._id;
  const token = UserData.token;
  const collegeId = UserData?.user_id?.collegeId;

  const [disabledBooks, setDisabledBooks] = useState({});

  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const primaryColor = "#4A90E2";
  const backgroundColor = "#F9FAFB";
  const cardBackground = "#FFFFFF";
  const buttonColor = "#F37A24";

  const { data } = useQuery({
    queryKey: ["userBooks.data", collegeId],
    queryFn: () => fetchBooksByCollegeId({ collegeId }),
  });

  const booksData = data?.data || [];
  console.log(" booksData : ", booksData)
  const filteredBooks = booksData.filter((book) => {
    const matchesQuery = searchQuery
      ? [book.name, book.author, book.category]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
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

  const startBookReadingCounterMutation = useMutation({
    mutationFn: (book) => {
      const data = {
        bookId: book._id,
        collegeId: collegeId
      }
      console.log(" data : ", data)
      return startBookReadingCounter(data);
    },
    onSuccess: (response, book) => {

      showAlert(`${book.name} has been started reading!`, "success");
      setSelectedBook(book);
    },
    onError: (error) => {
      showAlert(error.response?.data?.message || "Failed to start book reading!", "error");
    }
  })
  const handleStartBookReadingCounter = (book) => {
    startBookReadingCounterMutation.mutate(book)
  }

  // const handleStartBookReadingCounter = async (book) => {
  //   try {
  //     const response = await startBookReadingCounterMutation.mutateAsync(book);
  //     console.log("API response:", response);

  //     if (response?.data?.message === "Maximum reading limit reached. Try later!") {
  //       showAlert("You have reached the maximum reading limit. Try again later.", "error");

  //       // Disable the "View PDF" button for this book
  //       setDisabledBooks((prev) => ({ ...prev, [book._id]: true }));
  //       return;
  //     }

  //     if (response?.status === 200) {
  //       showAlert(`${book.name} has been started reading!`, "success");
  //       setSelectedBook(book);
  //     }
  //   } catch (error) {
  //     console.error("Error starting book reading:", error);

  //     if (error.response?.data?.message === "Maximum reading limit reached. Try later!") {
  //       showAlert("You have reached the maximum reading limit. Try again later.", "error");
  //       setDisabledBooks((prev) => ({ ...prev, [book._id]: true })); // Disable the button
  //     } else {
  //       showAlert(error.response?.data?.message || "Failed to start book reading!", "error");
  //     }
  //   }
  // };


  const stopBookReadingCounterMutation = useMutation({
    mutationFn: (book) => {
      const data = {
        bookId: book._id,
        collegeId: collegeId
      }
      return stopBookReadingCounter(data);
    },
    onSuccess: (response, book) => {
      showAlert(`${book.name} has been stopped reading!`, "success");
      setSelectedBook(null)
    },
    onError: (error) => {
      showAlert(error.response?.data?.message || "Failed to stop book reading!", "error");
    }
  })
  const handleStopBookReadingCounter = (book) => {
    if (book) {
      stopBookReadingCounterMutation.mutate(book);
    }
  }

  return (
    <Box sx={{
      margin: 0,
      flexGrow: 1,
      bgcolor: backgroundColor,
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}>
      <Grid container spacing={3}>
        {paginatedBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2, bgcolor: cardBackground, margin: 1 }}>
              <CardMedia component="img" height="200" image={`http://localhost:5000/${book.coverImage}`} alt={book.name} />
              <CardContent>
                <Typography gutterBottom variant="h6" sx={{ color: primaryColor }}>{book.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Author:</strong> {book.author}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" sx={{ bgcolor: buttonColor }}
                  disabled={disabledBooks[book._id]}
                  onClick={() => {
                    handleStartBookReadingCounter(book);
                  }}>
                  View PDF
                </Button>
                <Button size="small" variant="outlined" color="primary" onClick={() => handleAddToShelf(book)}>Add to Shelf</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedBook && (
        <PDFReader fileUrl={`http://localhost:5000/${selectedBook.bookPdf}`}
          sessionId={UserData._id}
          onClose={() => {
            if (selectedBook) {
              handleStopBookReadingCounter(selectedBook);
            }
            setSelectedBook(null);
          }} />
      )}
    </Box>
  );
};

export default UserBooks;

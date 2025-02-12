// import React, { useState } from 'react';
// import { AppBar, Tabs, Tab, Typography, Box } from '@mui/material';
// import { Home, Star, Subscriptions } from '@mui/icons-material'; // Importing icons
// import { styled } from '@mui/material/styles';
// import RecommendedBooks from '../../components/common/RecommendedBooks';

// const StyledAppBar = styled(AppBar)({
//     backgroundColor: '#3f51b5', // Change to a vibrant color
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow
// });

// const StyledTab = styled(Tab)({
//     flex: 1, // Make all tabs equal width
//     '&.Mui-selected': {
//         backgroundColor: '#fff', // Change background color when selected
//         color: '#3f51b5', // Change text color when selected
//     },
//     '&:hover': {
//         backgroundColor: 'rgba(255, 255, 255, 0.2)', // Add hover effect
//     },
// });

// const UserBooks = () => {
//     const [value, setValue] = useState(0);

//     const handleChange = (event, newValue) => {
//         setValue(newValue);
//     };

//     const TabPanel = (props) => {
//         const { children, value, index, ...other } = props;

//         return (
//             <div
//                 role="tabpanel"
//                 hidden={value !== index}
//                 id={`vertical-tabpanel-${index}`}
//                 aria-labelledby={`vertical-tab-${index}`}
//                 {...other}
//             >
//                 {value === index && (
//                     <Box p={3}>
//                         <Typography>{children}</Typography>
//                     </Box>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <div className="container">
//             <StyledAppBar position="static">
//                 <Tabs value={value} onChange={handleChange} aria-label="book tabs">
//                     <StyledTab label="Recommended Books" icon={<Star />} />
//                     <StyledTab label="Subscribed Books" icon={<Subscriptions />} />
//                 </Tabs>
//             </StyledAppBar>
//             <TabPanel value={value} index={0}>
//                 <RecommendedBooks />
//             </TabPanel>
//             <TabPanel value={value} index={1}>
//                 <Typography>List of subscribed books will be displayed here.</Typography>
//             </TabPanel>
//         </div>
//     );
// };

// export default UserBooks;

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
import { fetchBooksByCollegeId, addToShelf } from "../../apiCalls/BooksApi";
import { useDispatch, useSelector } from "react-redux";
import { addShelf } from "../../reduxwork/ShelfSlice";
import { useAlert } from "../../custom/CustomAlert";

const UserBooks = () => {
  const { showAlert } = useAlert();
  const dispatch = useDispatch();
  const { UserData } = useSelector((state) => state.user);

  const userid = UserData.user_id._id;
  const token = UserData.token;
  const collegeId = UserData?.user_id?.collegeId;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const primaryColor = "#4A90E2";
  const backgroundColor = "#F9FAFB";
  const cardBackground = "#FFFFFF";
  const buttonColor = "#F37A24";

  const { data } = useQuery({
    queryKey: ["userBooks", collegeId],
    queryFn: () => fetchBooksByCollegeId({ collegeId }),
  });

  const booksData = data?.data || [];

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
          sx={{ flex: 1, bgcolor: "#FFFFFF", borderRadius: 1 }}
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

      <Grid container spacing={3}>
        {paginatedBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2, bgcolor: cardBackground , margin:1}}>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:5000/${book.coverImage}`}
                alt={book.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" sx={{ color: primaryColor }}>
                  {book.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Author:</strong> {book.author}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" sx={{ bgcolor: buttonColor }}>
                  View PDF
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleAddToShelf(book)}
                >
                  Add to Shelf
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserBooks;




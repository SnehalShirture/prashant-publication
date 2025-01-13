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
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const RecommendedBooks = () => {
    const sampleBooks = [
        {
          name: "The Catcher in the Rye",
          author: "J.D. Salinger",
          category: "Classic",
          price: "12.99",
          publisher: "Little, Brown and Company",
          yearPublished: 1951,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "To Kill a Mockingbird",
          author: "Harper Lee",
          category: "Romance",
          price: "9.99",
          publisher: "J.B. Lippincott & Co.",
          yearPublished: 1960,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "Pride and Prejudice",
          author: "Jane Austen",
          category: "Romance",
          price: "14.99",
          publisher: "T. Egerton",
          yearPublished: 1813,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "Moby-Dick",
          author: "Herman Melville",
          category: "Adventure",
          price: "13.50",
          publisher: "Harper & Brothers",
          yearPublished: 1851,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "The Hobbit",
          author: "J.R.R. Tolkien",
          category: "Romance",
          price: "15.99",
          publisher: "George Allen & Unwin",
          yearPublished: 1937,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "War and Peace",
          author: "Leo Tolstoy",
          category: "Historical Fiction",
          price: "19.99",
          publisher: "The Russian Messenger",
          yearPublished: 1869,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "The Alchemist",
          author: "Paulo Coelho",
          category: "Romance",
          price: "11.99",
          publisher: "HarperOne",
          yearPublished: 1988,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "Crime and Punishment",
          author: "Fyodor Dostoevsky",
          category: "Romance",
          price: "12.50",
          publisher: "The Russian Messenger",
          yearPublished: 1866,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "Jane Eyre",
          author: "Charlotte Brontë",
          category: "Adventure",
          price: "10.99",
          publisher: "Smith, Elder & Co.",
          yearPublished: 1847,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "The Picture of Dorian Gray",
          author: "Oscar Wilde",
          category: "Philosophical Fiction",
          price: "9.99",
          publisher: "Ward, Lock & Co.",
          yearPublished: 1890,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "Brave New World",
          author: "Aldous Huxley",
          category: "Romance",
          price: "14.99",
          publisher: "Chatto & Windus",
          yearPublished: 1932,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "The Road",
          author: "Cormac McCarthy",
          category: "Adventure",
          price: "13.99",
          publisher: "Alfred A. Knopf",
          yearPublished: 2006,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "Animal Farm",
          author: "George Orwell",
          category: "Romance",
          price: "8.99",
          publisher: "Secker & Warburg",
          yearPublished: 1945,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "The Kite Runner",
          author: "Khaled Hosseini",
          category: "Adventure",
          price: "11.99",
          publisher: "Riverhead Books",
          yearPublished: 2003,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "A Tale of Two Cities",
          author: "Charles Dickens",
          category: "Fantasy",
          price: "10.99",
          publisher: "Chapman & Hall",
          yearPublished: 1859,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "1984",
          author: "George Orwell",
          category: "Adventure",
          price: "12.99",
          publisher: "Secker & Warburg",
          yearPublished: 1949,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          category: "Fantasy",
          price: "10.99",
          publisher: "Charles Scribner's Sons",
          yearPublished: 1925,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "Frankenstein",
          author: "Mary Shelley",
          category: "Adventure",
          price: "11.50",
          publisher: "Lackington, Hughes, Harding, Mavor & Jones",
          yearPublished: 1818,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "Dracula",
          author: "Bram Stoker",
          category: "Adventure",
          price: "13.99",
          publisher: "Archibald Constable and Company",
          yearPublished: 1897,
          coverImage: "https://via.placeholder.com/200",
        },
        {
          name: "The Odyssey",
          author: "Homer",
          category: "Adventure",
          price: "14.99",
          publisher: "Ancient Greece",
          yearPublished: "8th century BC",
          coverImage: "https://via.placeholder.com/200",
        },
      ];
      

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // Filter books based on search query (author) and selected category
  const filteredBooks = sampleBooks.filter((book) => {
    const matchesQuery = book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? book.category === selectedCategory
      : true;
    return matchesQuery && matchesCategory;
  });

  // Paginate the filtered books
  const paginatedBooks = filteredBooks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to the first page on search
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1); // Reset to the first page on category change
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
            <MenuItem value="Classic">Classic</MenuItem>
            <MenuItem value="Romance">Romance</MenuItem>
            <MenuItem value="Adventure">Adventure</MenuItem>
            <MenuItem value="Fantasy">Fantasy</MenuItem>
            <MenuItem value="Historical Fiction">Historical Fiction</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Books Grid */}
      <Grid container spacing={3}>
        {paginatedBooks.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={book.coverImage || "https://via.placeholder.com/200"}
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
                <Typography variant="body2" color="text.secondary">
                  <strong>Publisher:</strong> {book.publisher}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Year Published:</strong> {book.yearPublished}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" color="primary">
                  View Details
                </Button>
                <FavoriteBorderIcon style={{ color: "red" }} />
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
    </Box>
  );
};

export default RecommendedBooks;

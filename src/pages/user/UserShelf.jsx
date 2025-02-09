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
import { useQuery } from "@tanstack/react-query";
import { fetchShelfBooks } from "../../apiCalls/BooksApi";
import { useSelector } from "react-redux";
import PDFReader from "../../components/common/PDFReader";

const Shelf = () => {
  const { UserData } = useSelector((state) => state.user);
  const user_id = UserData.user_id._id;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch books using React Query
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ["shelfBooks", user_id],
    queryFn: async () => {
      const user = { _id: user_id };
      const response = await fetchShelfBooks(user);
      return response.data;
    },
    enabled: !!user_id, // Ensure it only runs if user_id exists
  });

  // Filter books based on search query and category
  const filteredBooks = books.filter((book) =>
    (book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory ? book.category === selectedCategory : true)
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: "80vh", backgroundColor: "#f9f9f9", p: 3 }}>
      {/* Search & Filter */}
      <Box sx={{ display: "flex", gap: 2, backgroundColor: "#E4F1FD", p: 2, borderRadius: 2 }}>
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
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Arts">Arts</MenuItem>
            <MenuItem value="Commerce">Commerce</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Book Grid */}
      {isLoading ? (
        <Typography sx={{ mt: 3 }}>Loading books...</Typography>
      ) : error ? (
        <Typography sx={{ mt: 3, color: "red" }}>Error loading books</Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {filteredBooks.map((book, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: 3 }}>
                <CardMedia component="img" height="200" image={`http://localhost:5000/${book.coverImage}`} alt={book.name} />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{book.name}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Author:</strong> {book.author}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Category:</strong> {book.category}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Price:</strong> ${book.price}</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2, width: "100%" }} onClick={() => setSelectedBook(book)}>
                    View PDF
                  </Button>
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
          onClose={() => setSelectedBook(null)}
        />
      )}
    </Box>
  );
};

export default Shelf;

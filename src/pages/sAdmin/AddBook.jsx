import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { addnewbook } from "../../apiCalls/BooksApi";
import { useAlert } from "../../custom/CustomAlert";


const AddBookForm = () => {
  const { showAlert } =useAlert();
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    category: "",
    price: "",
    publisher: "",
    otherPublisher: "",
    yearPublished: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [indexImage1, setIndexImage1] = useState(null);
  const [indexImage2, setIndexImage2] = useState(null);
  const [bookPdf, setBookPdf] = useState(null);

  const resetForm = () => {
    setFormData({
      name: "",
      author: "",
      category: "",
      price: "",
      publisher: "",
      otherPublisher: "",
      yearPublished: "",
    });
    setCoverImage(null);
    setIndexImage1(null);
    setIndexImage2(null);
    setBookPdf(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form Data Submitted:", formData);
      console.log("Files Submitted:", { coverImage, indexImage1, indexImage2, bookPdf });

      const res = await addnewbook({
        ...formData,
        coverImage,
        indexImage1,
        indexImage2,
        bookPdf,
      });

      console.log("Book Added Successfully:", res);
      showAlert("Book added successfully!" , "success"); // Provide user feedback
      resetForm(); // Clear the form after successful submission
    } catch (error) {
      console.error("Error Adding Book:", error.message);
      showAlert("Failed to add book. Please try again.", "error"); 
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 600,
        mx: "auto",
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add New Book
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Book Name"
              name="name"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Author"
              name="author"
              variant="outlined"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="Arts">Arts</MenuItem>
                <MenuItem value="Commerce">Commerce</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              variant="outlined"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Publisher"
              name="publisher"
              variant="outlined"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Other Publisher"
              name="otherPublisher"
              variant="outlined"
              value={formData.otherPublisher}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Year Published"
              name="yearPublished"
              type="number"
              variant="outlined"
              value={formData.yearPublished}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
            >
              Upload Cover Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange(setCoverImage)}
                required
              />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
            >
              Upload Index Image 1
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange(setIndexImage1)}
                required
              />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
            >
              Upload Index Image 2
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange(setIndexImage2)}
                required
              />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
            >
              Upload Book PDF
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={handleFileChange(setBookPdf)}
                required
              />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Book
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddBookForm;

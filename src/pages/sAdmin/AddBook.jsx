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
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { addnewbook } from "../../apiCalls/BooksApi";
import { useAlert } from "../../custom/CustomAlert";

const AddBookForm = () => {
  const { showAlert } = useAlert();
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

  const mutation = useMutation({
    mutationFn: async () => {
      return await addnewbook({
        ...formData,
        coverImage,
        indexImage1,
        indexImage2,
        bookPdf,
      });
    },
    onSuccess: () => {
      showAlert("Book added successfully!", "success");
      resetForm();
    },
    onError: (error) => {
      showAlert("Failed to add book. Please try again.", "error");
      console.error("Error Adding Book:", error);
    },
  });

  return (
    <Card sx={{ maxWidth: 650, mx: "auto", mt: 4, p: 3, boxShadow: 5 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          Add New Book
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Book Name" name="name" variant="outlined" value={formData.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Author" name="author" variant="outlined" value={formData.author} onChange={handleChange} required />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select name="category" value={formData.category} onChange={handleChange} required>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="Arts">Arts</MenuItem>
                  <MenuItem value="Commerce">Commerce</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Price" name="price" type="number" variant="outlined" value={formData.price} onChange={handleChange} required />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Publisher" name="publisher" variant="outlined" value={formData.publisher} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Other Publisher" name="otherPublisher" variant="outlined" value={formData.otherPublisher} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Year Published" name="yearPublished" type="number" variant="outlined" value={formData.yearPublished} onChange={handleChange} required />
            </Grid>

            {["Cover Image", "Index Image 1", "Index Image 2", "Book PDF"].map((label, idx) => (
              <Grid item xs={12} key={idx}>
                <Button variant="contained" component="label" startIcon={<CloudUpload />} fullWidth>
                  Upload {label}
                  <input type="file" hidden accept={label.includes("PDF") ? "application/pdf" : "image/*"} onChange={handleFileChange([setCoverImage, setIndexImage1, setIndexImage2, setBookPdf][idx])} required />
                </Button>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5 }} disabled={mutation.isLoading}>
                {mutation.isLoading ? <CircularProgress size={24} /> : "Add Book"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBookForm;

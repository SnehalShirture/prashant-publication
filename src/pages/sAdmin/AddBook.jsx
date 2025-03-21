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
  Paper,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { addnewbook } from "../../apiCalls/BooksApi";
import { useAlert } from "../../custom/CustomAlert";

const AddBookForm = () => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    subjectCode: "",
    name: "",
    author: "",
    category: "",
    price: "",
    publisher: "",
    otherPublisher: "",
    yearPublished: "",
    academicYear: "",
    currentSemester: "",
    university: "",
    type: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [indexImage1, setIndexImage1] = useState(null);
  const [indexImage2, setIndexImage2] = useState(null);
  const [bookPdf, setBookPdf] = useState(null);

  const resetForm = () => {
    setFormData({
      subjectCode: "",
      name: "",
      author: "",
      category: "",
      price: "",
      publisher: "",
      otherPublisher: "",
      yearPublished: "",
      academicYear: "",
      currentSemester: "",
      university: "",
      type: "",
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        p: 3,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%", borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center" color="primary">
          Add New Book
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <Grid container spacing={2}>
            {["subjectCode", "name", "author", "price", "publisher", "otherPublisher", "yearPublished", "currentSemester", "university"].map((name, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <TextField
                  fullWidth
                  label={name.replace(/([A-Z])/g, " $1").trim()}
                  name={name}
                  variant="outlined"
                  value={formData[name]}
                  onChange={handleChange}
                  required={["name", "author", "price", "publisher", "yearPublished"].includes(name)}
                />
              </Grid>
            ))}

            {["category", "academicYear", "type"].map((name, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <FormControl fullWidth>
                  <InputLabel>{name.replace(/([A-Z])/g, " $1").trim()}</InputLabel>
                  <Select name={name} value={formData[name]} onChange={handleChange} required>
                    {[
                      name === "category" ? ["arts", "commerce", "science"] :
                      name === "academicYear" ? ["FY", "SY", "TY"] :
                      ["textbook", "reference"],
                    ][0].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}

            {["Cover Image", "Index Image 1", "Index Image 2", "Book PDF"].map((label, idx) => (
              <Grid item xs={12} key={idx}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ py: 1 }}
                >
                  Upload {label}
                  <input
                    type="file"
                    hidden
                    accept={label.includes("PDF") ? "application/pdf" : "image/*"}
                    onChange={handleFileChange([setCoverImage, setIndexImage1, setIndexImage2, setBookPdf][idx])}
                    required
                  />
                </Button>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.5 }}>
                Add Book
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddBookForm;


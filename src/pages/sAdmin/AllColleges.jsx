import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, TextField, Grid, Modal } from "@mui/material";
import CustomTable from "../../custom/CustomTable";
import { createCollege , getColleges } from "../../apiCalls/UserApi";

const AllColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [addnewCollege, setAddCollege] = useState({
    clgName: "",
    clgStream: "",
    clgAddress: "",
    directorName: "",
    librarianName: "",
    librarianMobile: "",
    librarianEmail: "",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAddCollege({
      clgName: "",
      clgStream: "",
      clgAddress: "",
      directorName: "",
      librarianName: "",
      librarianMobile: "",
      librarianEmail: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddCollege((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCollege = async (e) => {
    e.preventDefault();
    try {
        const response = await  createCollege(addnewCollege);
        // Assuming response.data is the updated list of colleges
        setAddCollege(response.data); 
        console.log("New College Data:", response);
        handleClose();
    } catch (error) {
        console.log(addnewCollege);
        console.error("Failed to add college", error.response ? error.response.data : error.message);
    }
};

useEffect(() =>{
  const fetchAllColleges = async () =>{
    try {
      const response = await getColleges();
      console.log( "college data",response)
      setColleges(response.data);
  
    } catch (error) {
      console.log("Failed to fetch colleges", error.response ? error.data : error.message);
    }
  }
fetchAllColleges();
},[])


  const tableColumns = [
    { accessorKey: "clgName", header: "College Name", size: 200 },
    { accessorKey: "clgStream", header: "Stream", size: 200 },
    { accessorKey: "clgAddress", header: "Address", size: 200 },
    { accessorKey: "directorName", header: "Director Name", size: 200 },
    { accessorKey: "librarianName", header: "Librarian Name", size: 200 },
    { accessorKey: "librarianMobile", header: "Librarian Mobile", size: 200 },
    { accessorKey: "librarianEmail", header: "Librarian Email", size: 200 },
  ];

  return (
    <Box sx={{ padding: 4, margin:0 ,bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom>
        All Colleges
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Below is the list of all registered colleges.
      </Typography>

      <Box sx={{ marginTop: 5 }}>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
          <CustomTable data={colleges} columns={tableColumns} />
          <Box sx={{ textAlign: "right", marginTop: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              sx={{ borderRadius: 2 }}
              onClick={handleOpen}
            >
              Add New College
            </Button>
          </Box>
        </Paper>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New College
          </Typography>
          <Box component="form" onSubmit={handleAddCollege}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="College Name"
                  name="clgName"
                  value={addnewCollege.clgName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Stream"
                  name="clgStream"
                  value={addnewCollege.clgStream}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Address"
                  name="clgAddress"
                  value={addnewCollege.clgAddress}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Director Name"
                  name="directorName"
                  value={addnewCollege.directorName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Librarian Name"
                  name="librarianName"
                  value={addnewCollege.librarianName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Librarian Mobile"
                  name="librarianMobile"
                  value={addnewCollege.librarianMobile}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Librarian Email"
                  name="librarianEmail"
                  value={addnewCollege.librarianEmail}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2 }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AllColleges;

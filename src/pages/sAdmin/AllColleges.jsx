import React, { useState } from "react";
import { Box, Typography, Paper, Button, TextField, Grid, Modal } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomTable from "../../custom/CustomTable";
import { createCollege, getColleges } from "../../apiCalls/UserApi";

const AllColleges = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [addnewCollege, setAddCollege] = useState({
    clgName: "",
    clgStream: "",
    clgAddress: "",
    directorName: "",
    librarianName: "",
    librarianMobile: "",
    librarianEmail: "",
  });

  // Fetch colleges using React Query
  const { data: colleges = [], error } = useQuery({
    queryKey: ["colleges"],
    queryFn: getColleges,
  });

  // Mutation for adding a new college
  const mutation = useMutation({
    mutationFn: createCollege,
    onSuccess: () => {
      queryClient.invalidateQueries(["colleges"]); // Refresh college list
      handleClose();
    },
  });

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
    setAddCollege((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCollege = (e) => {
    e.preventDefault();
    mutation.mutate(addnewCollege);
  };

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
    <Box sx={{ padding: 4, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom>
        All Colleges
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Below is the list of all registered colleges.
      </Typography>

      <Box sx={{ marginTop: 5 }}>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
          {error ? (
            <Typography color="error">Failed to fetch colleges</Typography>
          ) : (
            <CustomTable data={colleges.data} columns={tableColumns} />
          )}

          <Box sx={{ textAlign: "right", marginTop: 2 }}>
            <Button variant="outlined" color="primary" sx={{ borderRadius: 2 }} onClick={handleOpen}>
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
              {[
                { label: "College Name", name: "clgName" },
                { label: "Stream", name: "clgStream" },
                { label: "Address", name: "clgAddress" },
                { label: "Director Name", name: "directorName" },
                { label: "Librarian Name", name: "librarianName" },
                { label: "Librarian Mobile", name: "librarianMobile" },
                { label: "Librarian Email", name: "librarianEmail" },
              ].map(({ label, name }) => (
                <Grid item xs={6} key={name}>
                  <TextField fullWidth label={label} name={name} value={addnewCollege[name]} onChange={handleInputChange} required />
                </Grid>
              ))}
              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 2 }} disabled={mutation.isLoading}>
                  {mutation.isLoading ? "Adding..." : "Submit"}
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

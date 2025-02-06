import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, TextField, Grid, Modal } from "@mui/material";
import CustomTable from "../../custom/CustomTable";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { registeruser, getstudentbyclgid } from "../../apiCalls/UserApi";

const AllStudents = () => {
  const { UserData } = useSelector((state) => state.user);
  const collegeId = UserData.user_id.collegeId;

  const [addStudent, setAddStudent] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    role: "user", // Default role for students
    collegeId: collegeId,
  });
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Mutation for adding a new student
  const addStudentMutation = useMutation({
    mutationFn: (newStudent) => registeruser(newStudent), // Ensure this is a function that returns a promise
    onSuccess: (newStudent) => {
      setStudents((prevStudents) => [...prevStudents, newStudent]);
      setAddStudent({
        name: "",
        lastName: "",
        email: "",
        password: "",
        mobile: "",
        role: "user",
        collegeId: collegeId,
      });
      setOpen(false);
      console.log("New Student Added:", newStudent);
    },
    onError: (error) => {
      console.log("Error adding new student:", error.message);
    },
  });

  // Mutation for fetching students
  const fetchStudentsMutation = useMutation({
    mutationFn: ({ collegeId }) => getstudentbyclgid({ collegeId }), // Ensure it returns a promise
    onSuccess: (studentsData) => {
      setStudents(studentsData.data);
    },
    onError: (error) => {
      console.log("Error fetching students:", error.message);
    },
  });

  // Fetch students when the component mounts or when the college ID changes
  useEffect(() => {
    fetchStudentsMutation.mutate({ collegeId });
  }, [collegeId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for adding a new student
  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStudent = {
      name: `${addStudent.name} ${addStudent.lastName}`,
      email: addStudent.email,
      password: addStudent.password,
      mobile: addStudent.mobile,
      role: addStudent.role,
      collegeId: addStudent.collegeId,
    };

    addStudentMutation.mutate(newStudent);
  };

  // Table columns configuration
  const tableColumns = [
    { accessorKey: "name", header: "Student Name", size: 250 },
    { accessorKey: "email", header: "Email Address", size: 250 },
    { accessorKey: "mobile", header: "Mobile", size: 250 },
  ];

  return (
    <Box sx={{ padding: 3, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom>
        All Students
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Below is the list of all registered students.
      </Typography>

      <Box sx={{ marginTop: 5 }}>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
          {fetchStudentsMutation.isLoading ? (
            <Typography>Loading students...</Typography>
          ) : fetchStudentsMutation.isError ? (
            <Typography color="error">Error fetching students</Typography>
          ) : (
            <CustomTable data={students} columns={tableColumns} />
          )}

          <Box sx={{ textAlign: "right", marginTop: 2 }}>
            <Button
              variant="outlined"
              color="warning"
              sx={{ borderRadius: 2 }}
              onClick={handleOpen}
            >
              Add New Student
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Add Student Modal */}
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
            Add New Student
          </Typography>
          <Box component="form" onSubmit={handleAddStudent}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="name"
                  value={addStudent.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={addStudent.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={addStudent.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={addStudent.password}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobile"
                  value={addStudent.mobile}
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
                  disabled={addStudentMutation.isLoading}
                >
                  {addStudentMutation.isLoading ? "Adding..." : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AllStudents;

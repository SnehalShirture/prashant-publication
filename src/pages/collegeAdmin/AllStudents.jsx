import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, TextField, Grid, Modal } from "@mui/material";
import CustomTable from "../../custom/CustomTable";
import { useSelector } from "react-redux";
import { addstudent ,getstudentbyclgid } from "../../apiCalls/UserApi";



const AllStudents = () => {
  const { UserData } = useSelector((state) => state.user);
  console.log(UserData)

  const [students, setStudents] = useState([]);
  const [addStudent, setAddStudent] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    role: "user", // Default role for students
  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch students by college ID
  const getUserByCollegeId = async (collegeId) => {
    try {
      const response = await getstudentbyclgid(collegeId);
      console.log(response.data)
      setStudents(response.data);
    } catch (error) {
      console.log("Error fetching students by college ID:", error.message);

    }
  };

  useEffect(() => {
    // Replace with your desired college ID
    const collegeId = 1;
    getUserByCollegeId(collegeId);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new student
  const addNewStudent = async (studentData) => {
    try {
      const response = await addstudent(studentData);
      return response.data;
    } catch (error) {
      console.log("Error adding new student:", error.message);
      throw error;
    }
  };

  // Handle form submission
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const newStudent = {
        name: `${addStudent.name} ${addStudent.lastName}`,
        email: addStudent.email,
        password: addStudent.password,
        mobile: addStudent.mobile,
        role: addStudent.role,
      };

      const addedStudent = await addNewStudent(newStudent);
      setStudents((prev) => [...prev, addedStudent]);
      console.log("New Student Added:", addedStudent);

      // Reset form fields and close modal
      setAddStudent({
        name: "",
        lastName: "",
        email: "",
        password: "",
        mobile: "",
        role: "user",
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  // Table columns configuration
  const tableColumns = [
    { accessorKey: "name", header: "Student Name", size: 200 },
    { accessorKey: "email", header: "Email Address", size: 300 },
    { accessorKey: "mobile", header: "Mobile", size: 150 },
  ];

  return (
    <Box sx={{ padding: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        All Students
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Below is the list of all registered students.
      </Typography>

      <Box sx={{ marginTop: 5 }}>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
          <CustomTable data={students} columns={tableColumns} />
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

export default AllStudents;

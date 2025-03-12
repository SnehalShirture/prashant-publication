import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Modal,
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton
} from "@mui/material";
import CustomTable from "../../custom/CustomTable";
import { useSelector } from "react-redux";
import { useMutation , useQueryClient } from "@tanstack/react-query";
import { registeruser, getstudentbyclgid  , uploadBulkStudents , activateUser } from "../../apiCalls/UserApi";
import * as XLSX from "xlsx";
import { useAlert } from "../../custom/CustomAlert";


const AllStudents = () => {
  const { showAlert } = useAlert();
  const { UserData } = useSelector((state) => state.user);
  const collegeId = UserData.user_id.collegeId;
  const queryClient = useQueryClient();


  const [addStudent, setAddStudent] = useState({
    name: "",
    lastName: "",
    email: "",
    mobile: "",
    role: "user",
    collegeId: collegeId,
  });
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Mutation for adding a new student
  const addStudentMutation = useMutation({
    mutationFn: (newStudent) => registeruser(newStudent),
    onSuccess: (newStudent) => {
      setStudents((prevStudents) => [...prevStudents, newStudent]);
      queryClient.invalidateQueries(["students", collegeId]);
      setAddStudent({
        name: "",
        lastName: "",
        email: "",
        mobile: "",
        role: "user",
        collegeId: collegeId,
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error adding new student:", error.message);
    },
  });

  // Mutation for fetching students
  const fetchStudentsMutation = useMutation({
    mutationFn: ({ collegeId }) => getstudentbyclgid({ collegeId }),
    onSuccess: (studentsData) => {
      console.log("studentsData : " , studentsData)
      setStudents(studentsData.data);
    },
    onError: (error) => {
      console.error("Error fetching students:", error.message);
    },
  });

  useEffect(() => {
    fetchStudentsMutation.mutate({ collegeId });
  }, [collegeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStudent = {
      name: `${addStudent.name} ${addStudent.lastName}`,
      email: addStudent.email,
      mobile: addStudent.mobile,
      role: addStudent.role,
      collegeId: addStudent.collegeId,
    };
    addStudentMutation.mutate(newStudent);
  };

  //active students
  const activateStudentMutation = useMutation({
    mutationFn: (email) => activateUser({ email: email }),
    onSuccess: () => {
      queryClient.invalidateQueries(["students", collegeId]);
      showAlert("Student activated successfully", "success");
    },
    onError: (error) => {
      console.error("Error activating student:", error.message);
      showAlert("Failed to activate student. Please try again.", "error");
    },
  });

  const handleActivateStudent = (email) => {
    activateStudentMutation.mutate(email);
  };

  // Handle file upload and parsing Excel data with validation
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Required fields validation
          const requiredKeys = ["name", "lastName", "email", "mobile"];
          const isValid = excelData.every((row) =>
            requiredKeys.every((key) => key in row)
          );

          if (!isValid) {
            alert(
              "Invalid Excel format. Make sure columns: name, lastName, email, mobile are present."
            );
            setUploading(false);
            return;
          }

          // Map the data with fixed keys and avoid duplicates
          const formattedData = excelData.map((row) => ({
            name: row["name"] || "",
            lastName: row["lastName"] || "",
            email: row["email"] || "",
            mobile: row["mobile"] || "",
            role: "user",
            collegeId: collegeId,
          }));
          const existingEmails = new Set(students.map((student) => student.email));

          const uniqueStudents = formattedData.filter(
            (student) => !existingEmails.has(student.email)
          );
          
          if (uniqueStudents.length === 0) {
            showAlert("All students already exist!", "warning");
            setUploading(false);
            return;
          }
          
          addBulkStudentsMutation.mutate(uniqueStudents);
          fetchStudentsMutation.mutate({ collegeId });
          
          const newStudents = formattedData.filter(
            (newStudent) =>
              !students.some((existing) => existing.email === newStudent.email)
          );

          setStudents((prevStudents) => [...prevStudents, ...newStudents]);
          showAlert("Students uploaded successfully!" , "success");
          console.log("formattedData : " , formattedData)
        } catch (error) {
          console.error("Error reading Excel file:", error);
          showAlert("Failed to read Excel file. Please upload a valid file." , "error");
        } finally {
          setUploading(false);
          e.target.value = null;
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  //mutation for uploadBulkStudents
  const addBulkStudentsMutation =  useMutation({
    mutationFn: (newStudent) => uploadBulkStudents(newStudent),
    onSuccess: () => {
      showAlert("Students uploaded successfully!" , "success");
      setStudents([]);
      fetchStudentsMutation.mutate({ collegeId });
      },
      onError: (error) => {
        console.error("Error uploading students:", error.message);
        showAlert("Failed to upload students. Please try again." , "error");
        },
    });

    
  const tableColumns = [
    { accessorKey: "name", header: "Student Name", size: 200 },
    { accessorKey: "email", header: "Email Address", size: 250 },
    { accessorKey: "mobile", header: "Mobile", size: 250 },
    {
      header: "Actions",
      size: 150,
      Cell: ({ row }) => (
        <FormControlLabel
          control={
            <Switch
              checked={row.original.password}
              onChange={(e) =>
                handleActivateStudent(row.original.email, e.target.checked)
              }
              color="success"
            />
          }
          label={row.original.password ? "Active" : "Inactive"}
        />
      ),
    },
    
  ];
  //njl864ho

  return (
    <Box sx={{ padding: 3, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom>
        All Students
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
        {fetchStudentsMutation.isLoading ? (
          <Typography>Loading students...</Typography>
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
          <Button
            variant="contained"
            component="label"
            color="primary"
            sx={{ marginLeft: 2 }}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Excel"}
            <input
              type="file"
              hidden
              accept=".xls,.xlsx"
              onChange={handleFileUpload}
            />
          </Button>
        </Box>
      </Paper>
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

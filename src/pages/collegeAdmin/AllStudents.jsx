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
import { useMutation, useQueryClient , useQuery } from "@tanstack/react-query";
import { registeruser, getstudentbyclgid, uploadBulkStudents, activateUser  } from "../../apiCalls/UserApi";
import * as XLSX from "xlsx";
import { useAlert } from "../../custom/CustomAlert";


const AllStudents = () => {
  const { showAlert } = useAlert();
  const { UserData } = useSelector((state) => state.user);
  const collegeId = UserData.user_id.collegeId;
  const queryClient = useQueryClient();
  const token = UserData.token;


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
      fetchStudentsMutation.mutate({ collegeId, token });
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
    mutationFn: ({ collegeId, token }) => getstudentbyclgid({ collegeId, token }),
    onSuccess: (studentsData) => {
      setStudents(studentsData.data);
    },
    onError: (error) => {
      console.error("Error fetching students:", error.message);
    },
  });

  useEffect(() => {
    fetchStudentsMutation.mutate({ collegeId, token });
  }, [collegeId, token]);

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
    mutationFn: ({ email, token }) => activateUser({ email: email, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["students", collegeId]);
      fetchStudentsMutation.mutate({ collegeId, token });
      showAlert("Student activated successfully", "success");
    },
    onError: (error) => {
      console.error("Error activating student:", error.message);
      showAlert("Failed to activate student. Please try again.", "error");
    },
  });

  const handleActivateStudent = (email) => {
    activateStudentMutation.mutate({ email, token });
  };

  // Handle file upload and parsing Excel data with validation
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!token) {
      showAlert("Authentication Error: Token is missing.", "error");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        // Validate required fields (ensure non-empty after trimming)
        const requiredKeys = ["name", "lastName", "email", "mobile"];
        const isValid = excelData.every((row) =>
          requiredKeys.every(
            (key) => row[key] && row[key].toString().trim() !== ""
          )
        );

        if (!isValid) {
          showAlert(
            "Invalid Excel format. Required columns (non-empty): name, lastName, email, mobile",
            "warning"
          );
          setUploading(false);
          return;
        }

        // Format data: combine first and last names into a single "name" field
        const formattedData = excelData.map((row) => {
          const firstName = row["name"].toString().trim();
          const lastName = row["lastName"].toString().trim();
          return {
            name: (firstName + " " + lastName).trim(),
            email: row["email"].toString().trim(),
            mobile: row["mobile"].toString().trim(),
            role: "user",
            collegeId: collegeId,
          };
        });
        console.log("Formatted Data to Send:", JSON.stringify(formattedData, null, 2)); // Debugging log

        const existingEmails = new Set(students.map((s) => s.email));
        const uniqueStudents = formattedData.filter(
          (student) => !existingEmails.has(student.email)
        );

        if (uniqueStudents.length === 0) {
          showAlert("All students already exist!", "warning");
          setUploading(false);
          return;
        }

        // Pass token and uniqueStudents inside the mutation
        addBulkStudentsMutation.mutate(
          { students: uniqueStudents, token },
          {
            onSuccess: () => {
              fetchStudentsMutation.mutate({ collegeId, token });
            },
            onError: (error) => {
              showAlert(`Upload Error: ${error.message}`, "error");
            },
          }
        );
      } catch (error) {
        console.log("Error reading Excel file:", error.message);
        showAlert("Failed to read Excel file. Please upload a valid file.", "error");
      } finally {
        setUploading(false);
        e.target.value = null;
      }
    };

    reader.readAsArrayBuffer(file);
  };



  //mutation for uploadBulkStudents
  const addBulkStudentsMutation = useMutation({
    mutationFn: ({ students, token }) => uploadBulkStudents({ students, token }),
    onSuccess: (uploadedStudents) => {
      showAlert("Students uploaded successfully!", "success");
      setStudents((prevStudents) => [...prevStudents, uploadedStudents]);
      fetchStudentsMutation.mutate({ collegeId, token });
    },
    onError: (error) => {
      console.log("Error uploading students:", error.message);
      showAlert("Failed to upload students. Please try again.", "error");
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
              onChange={(e) => {
                handleActivateStudent(row.original.email, e.target.checked);
              }}
              color="success"
            />
          }
          label={row.original.password ? "Active" : "Inactive"}
        />
      ),
    },
  ];

  return (
    <Box sx={{ padding: 3, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom>
        All Students
      </Typography>
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

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Modal,
} from "@mui/material";
import CustomTable from "../../custom/CustomTable";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { registeruser, getstudentbyclgid } from "../../apiCalls/UserApi";
import * as XLSX from "xlsx";

const AllStudents = () => {
  const { UserData } = useSelector((state) => state.user);
  const collegeId = UserData.user_id.collegeId;

  const [addStudent, setAddStudent] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
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
    },
    onError: (error) => {
      console.error("Error adding new student:", error.message);
    },
  });

  // Mutation for fetching students
  const fetchStudentsMutation = useMutation({
    mutationFn: ({ collegeId }) => getstudentbyclgid({ collegeId }),
    onSuccess: (studentsData) => {
      console.log(" studentsData : " , studentsData)
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
      password: addStudent.password,
      mobile: addStudent.mobile,
      role: addStudent.role,
      collegeId: addStudent.collegeId,
    };
    addStudentMutation.mutate(newStudent);
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

          const newStudents = formattedData.filter(
            (newStudent) =>
              !students.some((existing) => existing.email === newStudent.email)
          );

          setStudents((prevStudents) => [...prevStudents, ...newStudents]);
          alert("Students uploaded successfully!");
        } catch (error) {
          console.error("Error reading Excel file:", error);
          alert("Failed to read Excel file. Please upload a valid file.");
        } finally {
          setUploading(false);
          e.target.value = null;
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

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
    </Box>
  );
};

export default AllStudents;

// import React, { useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import * as XLSX from "xlsx";
// import { useMutation } from "@tanstack/react-query";
// import { registeruser } from "../../apiCalls/UserApi";
// import { useSelector } from "react-redux";

// const AllStudents = () => {
//   const { UserData } = useSelector((state) => state.user);
//   const collegeId = UserData.user_id.collegeId;
//   const [students, setStudents] = useState([]);

//   // Mutation for bulk student registration
//   const registerStudentsMutation = useMutation({
//     mutationFn: async (studentsList) => {
//       const registerPromises = studentsList.map((student) =>
//         registeruser(student)
//       );
//       return Promise.all(registerPromises);
//     },
//     onSuccess: () => {
//       console.log("All students registered successfully!");
//     },
//     onError: (error) => console.error("Error registering students:", error.message),
//   });

//   // Function to handle file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];

//       // Convert sheet data to JSON
//       const parsedData = XLSX.utils.sheet_to_json(sheet);

//       // Extract only required columns
//       const filteredData = parsedData.map((row) => ({
//         name: row["name"] || row["Name"] || "", // Handle different column name variations
//         lastName: row["lastName"] || row["Last Name"] || "",
//         email: row["email"] || row["Email"] || "",
//         mobile: row["mobile"] || row["Mobile"] || "",
//         password: "defaultPassword", // Assign a default password (changeable later)
//         role: "user",
//         collegeId: collegeId,
//       }));

//       setStudents(filteredData);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         Import Students Data
//       </Typography>

//       <Button variant="outlined" component="label">
//         Select Excel File
//         <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
//       </Button>

//       {students.length > 0 && (
//         <Box sx={{ marginTop: 2 }}>
//           <Typography>{students.length} students ready for import.</Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => registerStudentsMutation.mutate(students)}
//             disabled={registerStudentsMutation.isLoading}
//           >
//             {registerStudentsMutation.isLoading ? "Importing..." : "Save Students"}
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default AllStudents;

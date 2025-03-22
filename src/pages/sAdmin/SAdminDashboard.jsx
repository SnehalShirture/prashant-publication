import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar, useMediaQuery, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { Book, Add, AttachMoney, LibraryBooks, Edit } from "@mui/icons-material";
import { BarChart } from '@mui/x-charts/BarChart';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookReadData } from "../../apiCalls/UserApi";
import CustomTable from "../../custom/CustomTable";
import { fetchAllPackages, createPackage } from "../../apiCalls/PackageApi";
import { useAlert } from "../../custom/CustomAlert";

const SAdminDashboard = () => {
  const { showAlert } = useAlert();
  // Price options based on maxReaders
  const readerPrices = { 5: 2000, 10: 2500, 15: 3000, 20: 3500 };

  const isMobile = useMediaQuery("(max-width:600px)");
  const [open, setOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({
    category: "arts",
    academicYear: "FY",
    price: "",
    booksIncluded: ""
  });
  const queryClient = useQueryClient();

  //createPackage
  const { mutate: addPackage } = useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries(["packagedata.data"]);
      showAlert("Package Added Successfully", "success")
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to add package:", error.message);
      showAlert("Failed to add package. Please try again", "error")
    },
  });

  const handleSubmit = () => {
    if (!newPackage.category || !newPackage.academicYear || !newPackage.price) {
      showAlert("Please fill all required fields.", "error");
      return;
    }

    const packageData = {
      category: newPackage.category,
      academicYear: newPackage.academicYear,
      prices: [{ Price: Number(newPackage.price) }],
      // booksIncluded: newPackage.booksIncluded
    };
    addPackage(packageData);
  };

  //getAllPackages 
  const { data: packagedata = [] } = useQuery({
    queryKey: ["packagedata.data"],
    queryFn: fetchAllPackages,
  })
  console.log("pachage data : ", packagedata.data)

  //fetch bookReadData
  const { data } = useQuery({
    queryKey: ['bookReadData'],
    queryFn: getBookReadData,
  });

  const chartData = data?.data || [];

  const packageColumns = [
    { header: "Sr. No", accessorFn: (row, index) => index + 1, size: 10 },
    { header: "Category", accessorFn: (row) => row.category, size: 25 },
    { header: "Academic Year", accessorFn: (row) => row.academicYear, size: 25 },
    {
      header: "Price (₹)",
      size: 20,
      accessorFn: (row) => row.prices?.[0]?.Price || "N/A"
    },
    {
      header: "Books Included",
      size: 20,
      accessorFn: (row) => row.booksIncluded?.length || 0
    },
  ];

  const handleChange = (e) => {
    setNewPackage({ ...newPackage, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Welcome, Admin!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's an overview of your dashboard.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "#3f51b5", mr: 2 }}>
              <Book />
            </Avatar>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Our Publications
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                1,245
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "#ff9800", mr: 2 }}>
              <LibraryBooks />
            </Avatar>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Other Publications
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                980
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "#4caf50", mr: 2 }}>
              <AttachMoney />
            </Avatar>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                $150,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Box sx={{ mt: 4, width: "100%", overflowX: "auto" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Total Pages Read by Month
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <BarChart
            xAxis={[{ data: chartData.map(item => item.monthYear), scaleType: 'band' }]}
            series={[
              { data: chartData.map(item => item.totalPagesRead), label: 'Total Pages Read', color: "#8884d8" },
              { data: chartData.map(item => item.totalUsers), label: 'Total Users', color: "#82ca9d" }
            ]}
            width={isMobile ? 350 : 1500}
            height={400}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 2, overflow: "hidden" }}>
        <CustomTable columns={packageColumns} data={packagedata?.data || []} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpen(true)}>
            Add Package
          </Button>
        </Box>
      </Box>

      {/* Add Package Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Package</DialogTitle>
        <DialogContent>
          <TextField fullWidth select name="category" label="Category" value={newPackage.category} onChange={handleChange} margin="dense">
            <MenuItem value="arts">Arts</MenuItem>
            <MenuItem value="commerce">Commerce</MenuItem>
            <MenuItem value="science">Science</MenuItem>
          </TextField>
          <TextField fullWidth select name="academicYear" label="Academic Year" value={newPackage.academicYear} onChange={handleChange} margin="dense">
            <MenuItem value="FY">FY</MenuItem>
            <MenuItem value="SY">SY</MenuItem>
            <MenuItem value="TY">TY</MenuItem>
          </TextField>
          <TextField fullWidth type="number" name="price" label="Price (₹)" value={newPackage.price} onChange={handleChange} margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

     
    </Box>
  );
};

export default SAdminDashboard;

import { 
  Container, Typography, Paper, Grid, 
  Button, MenuItem, Select, FormControl, InputLabel 
} from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomTable from "../../custom/CustomTable"; 
import { updateSubscriptionStatus } from "../../apiCalls/SubscriptionApi";
import { useAlert } from "../../custom/CustomAlert";

const OrderDetail = () => {
  const { showAlert } = useAlert();
  const location = useLocation();
  const subscription = location?.state;
  const queryClient = useQueryClient();

  if (!subscription) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          No Subscription Data Available
        </Typography>
      </Container>
    );
  }
  console.log(" subscription dettail : " , subscription.data)

  // State for status update
  const [selectedStatus, setSelectedStatus] = useState(subscription.status || "");

  // React Query Mutation for updating status
  const mutation = useMutation({
    mutationFn: async (newStatus) => {
      const statusReqData = {
        subscriptionId: subscription._id,
        status: newStatus,
      };
      return await updateSubscriptionStatus(statusReqData);
    },
    onSuccess: () => {
      showAlert("Subscription status updated successfully!", "success");
      queryClient.invalidateQueries(["subscriptions"]); // Refresh subscriptions data
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      showAlert("Failed to update status. Please try again.", "error");
    }
  });

  // Handle Status Update
  const handleUpdateStatus = () => {
    if (!selectedStatus) {
      showAlert("Please select a status before updating!", "warning");
      return;
    }
    mutation.mutate(selectedStatus);
  };

  const collegeDetails = subscription.college?.[0];
  // Librarian Details
  const librarianData = {
    userName: collegeDetails?.librarianName || "N/A",
    userEmail: collegeDetails?.librarianEmail|| "N/A",
    userMobile: collegeDetails?.librarianMobile || "N/A",
  };

  // College Details
  const collegeData = {
    name: collegeDetails?.clgName || "N/A",
    stream: collegeDetails?.clgStream || "N/A",
    address: collegeDetails?.clgAddress || "N/A",
    director: collegeDetails?.directorName || "N/A",
  };

  // Table Columns
  const bookColumns = [
    { header: "Sr. No", accessorFn: (row, index) => index + 1 },
    { header: "Book Name", accessorKey: "name" },
    { header: "Author", accessorKey: "author" },
    { header: "Subscription Status", accessorKey: "status" },
  ];

  // Table Data
  const bookData = subscription.books?.map((book, index) => ({
    id: index + 1,
    name: book?.name || "Unknown",
    author: book?.author || "Unknown",
    status: subscription.status || "Pending",
  })) || [];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        Order Details
      </Typography>

      {/* Librarian Information */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Librarian Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography><strong>Name:</strong> {librarianData.userName}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography><strong>Email:</strong> {librarianData.userEmail}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography><strong>Mobile:</strong> {librarianData.userMobile}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* College Information */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          College (Library) Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography><strong>College Name:</strong> {collegeData.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Stream:</strong> {collegeData.stream}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Address:</strong> {collegeData.address}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Director:</strong> {collegeData.director}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Update Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Update Subscription Status
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                label="status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleUpdateStatus}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Updating..." : "Update Status"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Total Books Info */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Total Books Subscribed: {bookData.length}
      </Typography>

      {/* Subscribed Books Table */}
      <CustomTable 
        data={bookData} 
        columns={bookColumns} 
        enablePagination={true} 
        pageSize={5} 
      />
    </Container>
  );
};

export default OrderDetail;

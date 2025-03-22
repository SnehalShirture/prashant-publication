import {
  Container, Typography, Paper, Grid,
  Button, Box, MenuItem, Select, FormControl, InputLabel, Divider
} from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomTable from "../../custom/CustomTable";
import { updateSubscriptionStatus, sendQuotation, generateQuotationpdf } from "../../apiCalls/SubscriptionApi";
import { useAlert } from "../../custom/CustomAlert";
import { useSelector } from "react-redux";

const OrderDetail = () => {
  const { UserData } = useSelector((state) => state.user);
  const token = UserData.token;
  const { showAlert } = useAlert();
  const location = useLocation();
  const subscription = location?.state;
  const queryClient = useQueryClient();
  console.log("subscription : " ,subscription)

  if (!subscription) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          No Subscription Data Available
        </Typography>
      </Container>
    );
  }

  const [selectedStatus, setSelectedStatus] = useState(subscription.status || "");
  const [isSending, setIsSending] = useState(false);


  const mutation = useMutation({
    mutationFn: async (newStatus) => {
      return await updateSubscriptionStatus({
        data: { subscriptionId: subscription._id, status: newStatus },
        token,
      });
    },
    onSuccess: () => {
      showAlert("Subscription status updated successfully!", "success");
      queryClient.invalidateQueries(["subscriptions"]);
    },
    onError: () => showAlert("Failed to update status. Please try again.", "error"),
  });

  const handleUpdateStatus = () => {
    if (!selectedStatus) {
      showAlert("Please select a status before updating!", "warning");
      return;
    }
    mutation.mutate(selectedStatus);
  };

  // Handle Send Quotation
  const handleSendPdf = async () => {
    const collegeEmail = collegeDetails?.librarianEmail;
    if (!collegeEmail) {
      showAlert("College email not found!", "warning");
      return;
    }

    try {
      const pdfName = `Subscription_Quotation_${collegeDetails?.clgName}.pdf`

      const payload = {
        subscriptionId: subscription._id,
        email: collegeEmail,
        pdfurl: subscription?.subscriptionQuotation,
        pdfname: pdfName,
      };
      console.log("payload : ", payload)

      await sendQuotation(payload);
      showAlert("Quotation sent to College Email successfully!", "success");
    } catch (error) {
      console.log("Error sending quotation:", error.message);
      showAlert("Failed to send quotation. Please try again.", "error");
    }
  };

  // Mutation to send quotation email
  const sendQuotationMutation = useMutation({
    mutationFn: async () => {
      if (!subscription.subscriptionQuotation) {
        showAlert("Please generate the quotation first!", "warning");
        return;
      }
      setIsSending(true);
      const payload = {
        email: collegeDetails?.librarianEmail,
        pdfurl: subscription.subscriptionQuotation,
        token,
      };
      console.log("payload : ", payload)

      return await sendQuotation(payload);
    },
    onSuccess: (response) => {
      showAlert("Quotation sent successfully!", "success");
      console.log("Quotation response : ", response);
    },
    onError: (error) => {
      showAlert("Failed to send quotation. Try again.", "error");
      console.error("Error sending quotation:", error.message);
    },
  });

  //generateQuotationMutation
  const generateQuotationMutation = useMutation({
    mutationFn: async ({ subscriptionId }) => {
      console.log("Sending Subscription ID to API:", subscriptionId, token); // Debugging
      return await generateQuotationpdf({ subscriptionId, token });
    },
    onSuccess: (response) => {
      showAlert("Quotation PDF generated successfully!", "success");
      console.log("Quotation PDF generated successfully!", response);
    },
    onError: (error) => {
      showAlert("Failed to generate PDF. Try again.", "error");
      console.error("Error generating PDF:", error.message);
    },
  });
  const collegeDetails = subscription.college?.[0] || {};
  const librarianData = {
    userName: collegeDetails.librarianName || "N/A",
    userEmail: collegeDetails.librarianEmail || "N/A",
    userMobile: collegeDetails.librarianMobile || "N/A",
  };

  const collegeData = {
    name: collegeDetails.clgName || "N/A",
    stream: collegeDetails.clgStream || "N/A",
    address: collegeDetails.clgAddress || "N/A",
    director: collegeDetails.directorName || "N/A",
  };

  const bookColumns = [
    { header: "Sr. No", accessorFn: (_, index) => index + 1 },
    { header: "Book Name", accessorKey: "name" },
    { header: "Author", accessorKey: "author" },
    { header: "Subscription Status", accessorKey: "status" },
  ];

  const bookData = subscription.books?.map((book, index) => ({
    id: index + 1,
    name: book?.name || "Unknown",
    author: book?.author || "Unknown",
    status: subscription.status || "Pending",
  })) || [];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3, textAlign: "center" }}>
        Order Details
      </Typography>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Librarian Details</Typography>
        {subscription.isActive && (
          <>
            <Grid item xs={12} sm={6}><Typography><strong>Start Date : </strong>{new Date(subscription.startDate).toLocaleDateString()}</Typography></Grid>
            <Grid item xs={12} sm={6}><Typography><strong>End Date : </strong> {new Date(subscription.endDate).toLocaleDateString()}</Typography></Grid>
          </>
        )}
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}><Typography><strong>Name:</strong> {librarianData.userName}</Typography></Grid>
          <Grid item xs={12} sm={4}><Typography><strong>Email:</strong> {librarianData.userEmail}</Typography></Grid>
          <Grid item xs={12} sm={4}><Typography><strong>Mobile:</strong> {librarianData.userMobile}</Typography></Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>College (Library) Details</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><Typography><strong>College Name:</strong> {collegeData.name}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography><strong>Stream:</strong> {collegeData.stream}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography><strong>Address:</strong> {collegeData.address}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography><strong>Director:</strong> {collegeData.director}</Typography></Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Update Subscription Status</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" fullWidth onClick={handleUpdateStatus} disabled={mutation.isLoading}>
              {mutation.isLoading ? "Updating..." : "Update Status"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Total Books Subscribed: {bookData.length}</Typography>
      <CustomTable data={bookData} columns={bookColumns} enablePagination pageSize={5} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="warning"
          sx={{ mt: 2, mb: 3 }}
          onClick={() => {
            generateQuotationMutation.mutate({ subscriptionId : subscription._id })
          }}
          disabled={isSending}
        >
          {isSending ? "Processing..." : "Send Quotation"}
        </Button>
      </Box>
    </Container>
  );
};

export default OrderDetail;

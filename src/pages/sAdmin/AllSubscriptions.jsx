import React from "react";
import { Container, Typography, Button, CircularProgress, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../custom/CustomTable";
import { getAllSubscriptions } from "../../apiCalls/SubscriptionApi";

const AllSubscriptions = () => {
  const navigate = useNavigate();

  // Fetch subscriptions using React Query
  const { data: subscriptions = [], isLoading, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getAllSubscriptions,
  });

  // Table columns with additional data
  const columns = [
    { header: "Sr. No", accessorFn: (row, index) => index + 1 },
    { header: "College", accessorFn: (row) => row.college?.clgName || "N/A" },
    { header: "Librarian", accessorFn: (row) => row.user?.name || "N/A" },
    { header: "Mobile", accessorFn: (row) => row.user?.mobile || "N/A" },
    { header: "Total Books", accessorFn: (row) => row.totalBooks || "0" },
    { header: "Total Amount (₹)", accessorFn: (row) => row.totalAmount || "0" },
    { header: "Status", accessorKey: "status" },
    {
      header: "Action",
      accessorFn: (row) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => navigate(`/sadmin/orderdetail`, { state: row })}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh" }}>
        <CircularProgress size={50} color="primary" />
        <Typography variant="h6" sx={{ mt: 2, color: "gray" }}>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error" sx={{ textAlign: "center", mt: 5 }}>
          Error: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={550} sx={{ mb: 2 }}>
        All Subscriptions
      </Typography>

      {/* Display subscriptions in a custom table */}
      <CustomTable data={subscriptions.data} columns={columns} enablePagination={true} pageSize={5} />
    </Container>
  );
};

export default AllSubscriptions;

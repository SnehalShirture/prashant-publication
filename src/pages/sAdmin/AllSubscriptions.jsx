import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../custom/CustomTable";
import { getAllSubscriptions } from "../../apiCalls/SubscriptionApi";

const AllSubscriptions = () => {
  const navigate = useNavigate();

  // Fetch subscriptions using React Query
  const { data: subscriptionsData, error } = useQuery({
    queryKey: ["subscriptions.data"],
    queryFn: getAllSubscriptions,
  });

  const subscriptions = subscriptionsData?.data || []; // Handle missing data

  console.log("All subscriptions data:", subscriptions);

  // Table columns with adjusted data extraction
  const columns = [
    { header: "Sr. No", accessorFn: (row, index) => index + 1 },
    { header: "College", accessorFn: (row) => row.college?.[0]?.clgName || "N/A" },
    { header: "Librarian", accessorFn: (row) => row.college?.[0]?.librarianName || "N/A" },
    { header: "Mobile", accessorFn: (row) => row.college?.[0]?.librarianMobile || "N/A" },
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
      <CustomTable data={subscriptions} columns={columns} enablePagination={true} pageSize={5} />
    </Container>
  );
};

export default AllSubscriptions;

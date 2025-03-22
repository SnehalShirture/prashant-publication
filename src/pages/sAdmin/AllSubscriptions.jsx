import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../custom/CustomTable";
import { getAllSubscriptions, updateSubscriptionQuotation, generateQuotationpdf } from "../../apiCalls/SubscriptionApi";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import SubscriptionPDF from "../../custom/SubscriptionPdf";
import { useAlert } from "../../custom/CustomAlert";
import { useSelector } from "react-redux";


const AllSubscriptions = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { UserData } = useSelector((state) => state.user);
  const token= UserData.token;


  // Fetch subscriptions using React Query
  const { data: subscriptionsData } = useQuery({
    queryKey: ["subscriptions.data"],
    queryFn: () => getAllSubscriptions(token),
  });

  const subscriptions = subscriptionsData?.data || [];

  console.log("All subscriptions data:", subscriptions);

  // Function to generate and download PDF manually
  const handleGetBase64URL = async (row) => {
    const blob = await pdf(<SubscriptionPDF data={[row]} />).toBlob();
    const reader = new FileReader();
    reader.onload = async () => {
      const base64URL = reader.result;
      console.log("Base64 PDF URL:", base64URL);
      try {
        const response = await updateSubscriptionQuotation({
          _id: row._id,
          subscriptionQuotation: base64URL,
        });
        return response;
        // console.log("subscriptionQuotation response : ", response)
        // showAlert("Subscription quotation updated successfully", "success");
      } catch (error) {
        console.error("Error updating subscription quotation:", error.message);
        showAlert("Failed to update subscription quotation", "error");
      }
    };
    reader.readAsDataURL(blob);
  };

  // open pdf 
  const handleOpenPDF = async (row) => {
    const blob = await pdf(<SubscriptionPDF data={[row]} />).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    // Optionally, revoke the URL after some time to free memory
    // setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  //generateQuotationMutation
  const generateQuotationMutation = useMutation({
    mutationFn: async ({ subscriptionId }) => {
      console.log("Sending Subscription ID to API:", subscriptionId , token); // Debugging
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

  // Table columns
  const columns = [
    { header: "Sr. No", accessorFn: (row, index) => index + 1 },
    { header: "College", accessorFn: (row) => row.college?.[0]?.clgName || "N/A" },
    { header: "Librarian", accessorFn: (row) => row.college?.[0]?.librarianName || "N/A" },
    { header: "Mobile", accessorFn: (row) => row.college?.[0]?.librarianMobile || "N/A" },
    { header: "Total Books", accessorFn: (row) => row.totalBooks || "0" },
    { header: "Total Amount (₹)", accessorFn: (row) => row.totalAmount || "0" },
    { header: "Status", accessorKey: "status" },
    // {
    //   header: "Generate Quotation",
    //   accessorFn: (row) => (
    //     <Button
    //       variant="outlined"
    //       color="primary"
    //       size="small"
    //       onClick={() => {
    //         console.log("Subscription ID for PDF:", row._id); // Debugging log
    //         generateQuotationMutation.mutate({ subscriptionId: row._id });
    //       }}
    //     >
    //       {generateQuotationMutation.isLoading ? "Generating..." : "Generate PDF"}
    //     </Button>
    //   ),
    // },
    {
      header: "View Details",
      accessorFn: (row) => (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => navigate(`/sadmin/orderdetail`, { state: row })}
        >
          View Details
        </Button>
      ),
    },
    // {
    //   header: "PDF",
    //   accessorFn: (row) => (
    //     <PDFDownloadLink
    //         document={<SubscriptionPDF data={[row]} />}
    //         fileName={`Subscription_${row.college?.[0]?.clgName || "N/A"}.pdf`}
    //       >
    //     <Button
    //       variant="outlined"
    //       color="secondary"
    //       size="small"
    //       onClick={() => handleGetBase64URL(row)}
    //     >
    //       Download PDF
    //     </Button>
    //    </PDFDownloadLink>
    //   ),
    // },
  ];

  return (
    <Box>
      <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={550} sx={{ mb: 2 }}>
        All Subscriptions
      </Typography>

      <CustomTable data={subscriptions} columns={columns} enablePagination={true} pageSize={5} />
    </Container>
    </Box>
  );
};

export default AllSubscriptions;

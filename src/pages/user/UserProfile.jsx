import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Paper,
  Typography,
  Divider,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useSelector } from "react-redux";
import { LineChart } from "@mui/x-charts/LineChart";
import { getreadingdatabytuserid } from "../../apiCalls/UserApi";
import { useAlert } from "../../custom/CustomAlert";
import { useQuery } from "@tanstack/react-query";
import UpdatePasswordModal from "../../custom/UpdatePassword";

const UserProfile = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Access user data from Redux store
  const { UserData, islogin } = useSelector((state) => state.user);

  const [updatePasswordModalOpen, setUpdatePasswordModalOpen] = useState(false);

  // React Query to fetch reading data
  const fetchReadingData = async (userId) => {
    const response = await getreadingdatabytuserid({ userId });
    return response.data;
  };

  const { data: readingData = [], error } = useQuery({
    queryKey: ["readingData", UserData?.user_id?._id],
    queryFn: () => fetchReadingData(UserData.user_id._id),
    enabled: !!UserData?.user_id?._id, // Fetch only if user ID exists
  });

  if (!islogin || !UserData) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          No user data available. Please log in.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* User Profile Card */}
      <Card elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          {UserData.user_id.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Email:</strong> {UserData.user_id.email}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          <strong>Phone:</strong> {UserData.user_id.mobile}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          <strong>Role:</strong> {UserData.user_id.role}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained"
            color="primary"
            onClick={() => setUpdatePasswordModalOpen(true)}
          >
            Update Password
          </Button>
        </Box>
      </Card>

      {/* Reading Stats Section */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
          Reading Activity
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {error ? (
          <Typography color="error">Error fetching data</Typography>
        ) : readingData.length > 0 ? (
          <LineChart
            xAxis={[
              {
                data: readingData.map((item) => item.monthYear),
                label: "Months",
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: readingData.map((item) => item.totalPageCounter),
                label: "Total Pages Read",
              },
            ]}
            width={isMobile ? 350 : 700} // Responsive width
            height={300}
          />
        ) : (
          <Typography variant="body1" color="text.secondary">
            No reading data available.
          </Typography>
        )}
      </Paper>

      {/* Update Password Modal */}
      <UpdatePasswordModal
        open={updatePasswordModalOpen}
        onClose={() => setUpdatePasswordModalOpen(false)}
        email={UserData.user_id.email}
        token={UserData.token}
      />
    </Box>
  );
};

export default UserProfile;

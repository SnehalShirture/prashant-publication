import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";
import { logout } from "../../reduxwork/UserSlice";
import { userlogout, getreadingdatabytuserid } from "../../apiCalls/UserApi";
import { useAlert } from "../../custom/CustomAlert";


const UserProfile = () => {
  const { showAlert } = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access user data from Redux store
  const { UserData, islogin } = useSelector((state) => state.user);

  // State for reading data
  const [readingData, setReadingData] = useState([]);
  const [readingMonths, setReadingMonths] = useState([]);

  // Logout handler
  const handleLogout = async () => {
    try {
      const userdata = {
        userId: UserData.user_id._id,
      };
      console.log(userdata)
      const res = await userlogout(userdata);
      console.log(res);
      showAlert("You have been logged out successfully","success")
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error.message);
      showAlert("Error logging out. Please try again later","error")
    }
  };

  // Fetch reading data by user_id
  useEffect(() => {
    const fetchReadingData = async () => {
      const userid = {
        userId: UserData.user_id._id,
      };

      try {
        const res = await getreadingdatabytuserid(userid);
        console.log("Reading response:", res.data);

        // Update chart data
        const months = res.data.map((item) => item.monthYear); // ['Jan 2025', 'Feb 2025']
        const counters = res.data.map((item) => item.totalPageCounter); // [21, 30]

        setReadingMonths(months);
        setReadingData(counters);
      } catch (error) {
        console.error("Error fetching reading stats:", error.message);
      }
    };

    fetchReadingData();
  }, [UserData]);

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
      <Card
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
        }}
      >
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
            sx={{ mr: 2 }}
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Card>

      {/* Reading Stats Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color="primary"
          sx={{ mb: 3 }}
        >
          Reading Activity
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {readingData.length > 0 ? (
          <LineChart
            xAxis={[
              {
                data: readingMonths, // x-axis labels
                label: "Months",
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: readingData, // y-axis data
                label: "Total Pages Read",
              },
            ]}
            width={700}
            height={300}
          />
        ) : (
          <Typography variant="body1" color="text.secondary">
            No reading data available.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default UserProfile;

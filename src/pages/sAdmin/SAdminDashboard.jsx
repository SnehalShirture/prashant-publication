import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar, useMediaQuery } from "@mui/material";
import { Book, AttachMoney, LibraryBooks } from "@mui/icons-material";
import { LineChart } from '@mui/x-charts/LineChart';
import { getBookReadData } from "../../apiCalls/UserApi";

const SAdminDashboard = () => {
  const [chartData, setChartData] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBookReadData();
        setChartData(response.data);
        console.log("chart Response : ", response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

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
          <LineChart
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
    </Box>
  );
};

export default SAdminDashboard;

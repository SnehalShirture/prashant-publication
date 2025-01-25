import React from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import { Book, AttachMoney, LibraryBooks } from "@mui/icons-material";

const SAdminDashboard = () => {
  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Welcome Message */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Welcome, Admin!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's an overview of your dashboard.
        </Typography>
      </Box>

      {/* Dashboard Cards */}
      <Grid container spacing={3}>
        {/* Our Publications */}
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

        {/* Other Publications */}
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

        {/* Total Revenue */}
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
    </Box>
  );
};

export default SAdminDashboard;

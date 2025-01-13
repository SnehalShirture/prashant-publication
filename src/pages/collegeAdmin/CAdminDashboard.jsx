import React, { useState } from 'react';
import { Box, Grid, Typography, Paper, Avatar, Button } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Groups2Icon from '@mui/icons-material/Groups2';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CustomTable from '../../custom/CustomTable'; // Import the CustomTable component

const LibraryAdminDashboard = () => {
    const [tableData] = useState([
        { id: 1, studentName: "Alice Smith", action: "Borrowed 'Advanced Mathematics'", date: "2023-12-25" },
        { id: 2, studentName: "Bob Johnson", action: "Returned 'Physics Vol 1'", date: "2023-12-24" },
        { id: 3, studentName: "Charlie Brown", action: "Borrowed 'World History'", date: "2023-12-23" },
        { id: 4, studentName: "David Clark", action: "Paid late fee", date: "2023-12-22" },
        { id: 5, studentName: "Eva Green", action: "Reserved 'Modern Biology'", date: "2023-12-21" },
    ]);

    const tableColumns = [
        { accessorKey: 'studentName', header: 'Student Name', size: 200 },
        { accessorKey: 'action', header: 'Activity', size: 300 },
        { accessorKey: 'date', header: 'Date', size: 150 },
    ];

    const AdminData = { name: "John Doe" };
    const dashboardData = [
        { title: "Total Books", value: 1200, icon: <LibraryBooksIcon fontSize="large" />, color: "#3f51b5" },
        { title: "Total Students", value: 350, icon: <Groups2Icon fontSize="large" />, color: "#4caf50" },
        { title: "Recent Activities", value: 25, icon: <ReceiptIcon fontSize="large" />, color: "#ff9800" },
        { title: "Total Revenue", value: "$15,000", icon: <MonetizationOnIcon fontSize="large" />, color: "#f44336" },
    ];

    return (
        <Box sx={{ padding: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
            <Typography variant="h4" gutterBottom>
                Welcome, <strong>{AdminData.name}</strong>
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Manage your library efficiently with the admin dashboard.
            </Typography>

            {/* Dashboard Summary Cards */}
            <Grid container spacing={4} sx={{ marginTop: 2 }}>
                {dashboardData.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            elevation={4}
                            sx={{
                                padding: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: item.color,
                                color: "#fff",
                                borderRadius: 2,
                            }}
                        >
                            <Avatar sx={{ bgcolor: "#fff", color: item.color, mb: 2, width: 56, height: 56 }}>
                                {item.icon}
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {item.value}
                            </Typography>
                            <Typography variant="body1">{item.title}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Activities Table */}
            <Box sx={{ marginTop: 5 }}>
                <Typography variant="h5" gutterBottom>
                    Recent Activities
                </Typography>
                <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                    <CustomTable data={tableData} columns={tableColumns} />
                    <Box sx={{ textAlign: "right", marginTop: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 2 }}
                        >
                            View All Activities
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default LibraryAdminDashboard;

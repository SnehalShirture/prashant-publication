import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Typography, Box } from '@mui/material';
import { Home, Star, Subscriptions } from '@mui/icons-material'; // Importing icons
import { styled } from '@mui/material/styles';
import RecommendedBooks from '../../components/common/RecommendedBooks';

const StyledAppBar = styled(AppBar)({
    backgroundColor: '#3f51b5', // Change to a vibrant color
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow
});

const StyledTab = styled(Tab)({
    flex: 1, // Make all tabs equal width
    '&.Mui-selected': {
        backgroundColor: '#fff', // Change background color when selected
        color: '#3f51b5', // Change text color when selected
    },
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Add hover effect
    },
});

const UserBooks = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    };

    return (
        <div className="container">
            <StyledAppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="book tabs">
                    <StyledTab label="Recommended Books" icon={<Star />} />
                    <StyledTab label="Subscribed Books" icon={<Subscriptions />} />
                </Tabs>
            </StyledAppBar>
            <TabPanel value={value} index={0}>
                <RecommendedBooks />
                {/* <Typography variant="h5" gutterBottom>
                    Recommended Books 
                </Typography> */}
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Typography>List of subscribed books will be displayed here.</Typography>
            </TabPanel>
        </div>
    );
};

export default UserBooks;
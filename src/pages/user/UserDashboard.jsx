import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Container,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import TooltipComponent from '@mui/material/Tooltip';
import CustomTable from '../../custom/CustomTable';
import PropTypes from 'prop-types';
import { getBooks } from '../../apiCalls/BooksApi'; // Import getBooks API

// TabPanel Component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const Dashboard = () => {
  const [value, setValue] = useState(0);
  const [books, setBooks] = useState([]); // State to store book data
  const [loading, setLoading] = useState(true); // Loading state
  const categories = ["All", "Science", "Arts", "Engineering", "Commerce"];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    { header: 'Sr.No', accessorFn: (row, index) => index + 1 },
    { header: 'Title', accessorKey: 'name' },
    { header: 'Author', accessorKey: 'author' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Price', accessorKey: 'price' },
    { header: 'Publisher', accessorKey: 'publisher' },
    { header: 'Year Published', accessorKey: 'yearPublished' },
    {
      header: 'Actions',
      accessorFn: (row) => row,
      Cell: ({ cell }) => (
        <Box>
          <TooltipComponent title="View Details">
            <IconButton
              onClick={() => console.log("View Book", cell.getValue())}
              color="secondary"
            >
              <EastIcon fontSize="small" />
            </IconButton>
          </TooltipComponent>
        </Box>
      ),
    },
  ];

  // Fetch book data on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await getBooks(); // Fetch books from API
        setBooks(response.data); // Assuming API response contains a 'data' field with books
      } catch (error) {
        console.error("Error fetching books:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on selected category
  const filteredBooks =
    value === 0
      ? books
      : books.filter((book) => book.category === categories[value]);

  return (
    <Box sx={{ p: 2, backgroundColor: '#e7e7ff' }}>
      <Container>
        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 3, justifyContent: 'space-between', mt: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: '12px',
                boxShadow: 3,
                height: '15vh',
              }}
            >
              <Typography variant="h6">All Books</Typography>
              <Typography variant="h4">{books.length}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: '12px',
                boxShadow: 3,
                height: '15vh',
              }}
            >
              <Typography variant="h6">Recently Viewed</Typography>
              <Typography>Recently viewed books will appear here</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Book Categories Tabs */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h4' fontWeight={550} sx={{ mb: 0.4 }}>Book Categories</Typography>
          </Box>
          <Box sx={{ height: 45 }}>
            <Tabs value={value} onChange={handleChange} aria-label="book categories" sx={{ minHeight: 45 }}>
              {categories.map((category, index) => (
                <Tab
                  key={category}
                  label={category}
                  id={`tab-${index}`}
                  aria-controls={`tabpanel-${index}`}
                  sx={{ fontWeight: 450, textTransform: "none", minHeight: 45 }}
                />
              ))}
            </Tabs>
          </Box>
          <TabPanel value={value} index={value}>
            {loading ? (
              <Typography>Loading books...</Typography>
            ) : (
              <CustomTable data={filteredBooks} columns={columns} />
            )}
          </TabPanel>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;

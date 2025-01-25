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
  CircularProgress,
} from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import Tooltip from '@mui/material/Tooltip';
import CustomTable from '../../custom/CustomTable';
import PropTypes from 'prop-types';
import { getBooks } from '../../apiCalls/BooksApi';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const Dashboard = () => {
  const [value, setValue] = useState(0);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = ['All', 'Science', 'Arts', 'Engineering', 'Commerce'];

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
        <Tooltip title="View Details">
          <IconButton
            onClick={() => console.log('View Book', cell.getValue())}
            color="primary"
          >
            <AutoStoriesIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await getBooks();
        setBooks(response.data || []);
      } catch (error) {
        console.error('Error fetching books:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks =
    value === 0
      ? books
      : books.filter((book) => book.category === categories[value]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#E9F1FA', // Light blue background
        color: 'white',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Overview Section */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 4,
                borderRadius: '16px',
                backgroundColor: '#00ABE4', // Bright blue background
                color: 'white',
                boxShadow: 6,
                height: '70%',
                textAlign: 'center',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Total Books
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {books.length}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 4,
                borderRadius: '16px',
                backgroundColor: '#FFFFFF', // White background
                color: 'black',
                boxShadow: 6,
                height: '70%',
                textAlign: 'center',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Recently Viewed
              </Typography>
              <Typography variant="body1">
                Recently viewed books will appear here.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 4,
                borderRadius: '16px',
                backgroundColor: '#00ABE4', // Bright blue background
                color: 'white',
                boxShadow: 6,
                height: '70%',
                textAlign: 'center',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Recent Additions
              </Typography>
              <Typography variant="body1">
                Explore the newest books in our collection.
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Book Categories Section */}
        <Box>
          <Typography
            variant="h4"
            fontWeight={550}
            sx={{
              mb: 3,
              textShadow: '2px 2px 5px rgba(0,0,0,0.5)',
              color: '#00ABE4', // Bright blue for the title
            }}
          >
            Book Categories
          </Typography>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="book categories"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {categories.map((category, index) => (
              <Tab
                key={category}
                label={category}
                id={`tab-${index}`}
                aria-controls={`tabpanel-${index}`}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  color: '#00ABE4',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                  },
                }}
              />
            ))}
          </Tabs>

          {/* Tab Content */}
          <TabPanel value={value} index={value}>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress color="inherit" />
              </Box>
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

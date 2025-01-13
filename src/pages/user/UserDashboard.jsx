import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Box,
  Typography,
  Card,
  Grid,
  Container,
  Tabs,
  Tab,
  CardContent,
  Pagination,
  Grid2
} from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import IconButton from '@mui/material/IconButton';
import TooltipComponent from '@mui/material/Tooltip';
import CustomTable from '../../custom/CustomTable';
import PropTypes from 'prop-types';


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
      {value === index && (
        <Box p={2}>{children}</Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};


const Dashboard = () => {
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(1);
  const booksPerPage = 2;
  const [open, setOpen] = useState(false);

  const categories = ["All", "Science", "Arts", "Engineering", "Commerce"];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }


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
          <TooltipComponent title="Details">
            <IconButton
              onClick={() => navigate('', { state: cell.getValue() })}
              color="secondary"
            >
              <EastIcon fontSize="small" />
            </IconButton>
          </TooltipComponent>
        </Box>
      ),
    },
  ];
  const bookData = [
    {
      name: "The Hobbit",
      author: "J.R.R. Tolkien",
      category: "Arts",
      price: "15.99",
      publisher: "George Allen & Unwin",
      yearPublished: 1937,
    },
    {
      name: "1984",
      author: "George Orwell",
      category: "Science",
      price: "12.99",
      publisher: "Secker & Warburg",
      yearPublished: 1949,
    },
    {
      name: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Commerce",
      price: "10.99",
      publisher: "J.B. Lippincott & Co.",
      yearPublished: 1960,
    },
    {
      name: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Engineering",
      price: "11.00",
      publisher: "Secker & Warburg.",
      yearPublished: 1898,
    },
    {
      name: "Pride and Prejudice",
      author: "Jane Austen",
      category: "Arts",
      price: "10.99",
      publisher: "T. Egerton, Whitehall",
      yearPublished: 1813,
    },
    {
      name: "Hamlet",
      author: "William Shakespeare",
      category: "Arts",
      price: "12.50",
      publisher: "The Folger Shakespeare Library",
      yearPublished: 1609,
    },
    {
      name: "The Selfish Gene",
      author: "Richard Dawkins",
      category: "Science",
      price: "15.99",
      publisher: "Oxford University Press",
      yearPublished: 1976,
    },
    {
      name: "The Origin of Species",
      author: "Charles Darwin",
      category: "Science",
      price: "20.00",
      publisher: "John Murray",
      yearPublished: 1859,
    },
    {
      name: "Mechanics of Materials",
      author: "Ferdinand Beer",
      category: "Engineering",
      price: "24.99",
      publisher: "McGraw-Hill Education",
      yearPublished: 2015,
    },
    {
      name: "Rich Dad Poor Dad",
      author: "Robert T. Kiyosaki",
      category: "Commerce",
      price: "12.99",
      publisher: "Warner Books Ed",
      yearPublished: 1997,
    },
    {
      name: "The Intelligent Investor",
      author: "Benjamin Graham",
      category: "Commerce",
      price: "22.99",
      publisher: "Harper & Brothers",
      yearPublished: 1949,
    },
    {
      name: "Principles: Life and Work",
      author: "Ray Dalio",
      category: "Commerce",
      price: "19.99",
      publisher: "Simon & Schuster",
      yearPublished: 2017,
    }
  ];

  const totalBooks = 123;
  const recentlyViewedBooks = ['React Made Easy', 'Advanced React Patterns', 'JavaScript Mastery'];
  // const navigate = useNavigate();


  const filteredBooks = value === 0
    ? bookData
    : bookData.filter(book => book.category === categories[value]);

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
              <Typography variant="h4">{totalBooks}</Typography>
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
              {recentlyViewedBooks.map((book, index) => (
                <Typography key={index}>{book}</Typography>
              ))}
            </Card>
          </Grid>
        </Grid>


        {/* Books Caterories Tabs */}
        <Box sx={{ p: 2}}>
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
            <CustomTable data={filteredBooks} columns={columns} />
          </TabPanel>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;



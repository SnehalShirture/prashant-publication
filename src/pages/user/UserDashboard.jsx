import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import CustomTable from "../../custom/CustomTable";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "../../apiCalls/BooksApi";

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
  const categories = ["All", "Science", "Arts", "Engineering", "Commerce"];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    { header: "Sr.No", accessorFn: (row, index) => index + 1 },
    { header: "Title", accessorKey: "name" },
    { header: "Author", accessorKey: "author" },
    { header: "Category", accessorKey: "category" },
    { header: "Price", accessorKey: "price" },
    { header: "Publisher", accessorKey: "publisher" },
    { header: "Year Published", accessorKey: "yearPublished" },
  ];

  // Fetch books using React Query
  const { data: books = [] } = useQuery({
    queryKey: ["books.data"],
    queryFn: getBooks,
  });

  const filteredBooks =
    value === 0
      ? books.data || []
      : books.data?.filter((book) => book.category === categories[value]);

  // Array for Dashboard Cards
  const dashboardStats = [
    { title: "Total Books", value: books.data?.length || 0 },
    { title: "Recently Viewed", description: "Recently viewed books will appear here." },
    { title: "Recent Additions", description: "Explore the newest books in our collection." },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#E9F1FA",
        color: "white",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Overview Section */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          {dashboardStats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, rgb(133, 164, 231), rgb(197, 130, 130))",
                  color: "white",
                  boxShadow: 6,
                  height: "70%",
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {stat.title}
                </Typography>
                {stat.value ? (
                  <Typography variant="h2" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                ) : (
                  <Typography variant="body1">{stat.description}</Typography>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Book Categories Section */}
        <Box>
          <Typography
            variant="h4"
            fontWeight={550}
            sx={{
              mb: 3,
              textShadow: "2px 2px 5px rgba(0,0,0,0.5)",
              color: "#00ABE4",
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
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {categories.map((category, index) => (
              <Tab
                key={category}
                label={category}
                id={`tab-${index}`}
                aria-controls={`tabpanel-${index}`}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  color: "#00ABE4",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                  },
                }}
              />
            ))}
          </Tabs>

          {/* Tab Content */}
          <TabPanel value={value} index={value}>
            <CustomTable data={filteredBooks} columns={columns} />
          </TabPanel>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;

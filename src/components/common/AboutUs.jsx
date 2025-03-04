import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";

const AboutUs = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        px: 3,
        py: 2,
        mt:2
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
           {/* Image Section */}
           <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src="aboutus.jpg"
              alt="Digital Library"
              style={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "16px",
                boxShadow: "0px 12px 12px rgba(0,0,0,0.2)",
              }}
            />
          </Box>
          {/* Text Content */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" fontWeight="bold" color="gray" gutterBottom>
              About Us
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Our digital library provides access to a vast collection of e-books, research papers,
              and articles. We are committed to making knowledge accessible to everyone, regardless of
              their location or background.
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              With an intuitive interface and seamless navigation, we offer a user-friendly reading
              experience tailored to learners, researchers, and book enthusiasts.
            </Typography>
            {/* <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Learn More
            </Button> */}
          </Box>

         
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;

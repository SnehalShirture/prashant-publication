import React from "react";
import { Box, Container, Typography, Card, CardContent, Avatar } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample Team Data for digital library
const teamMembers = [
  { name: "John Doe", role: "CEO", image: "aboutus.jpg" },
  { name: "Jane Smith", role: "CTO", image: "aboutus.jpg" },
  { name: "Emily Davis", role: "Lead Designer", image: "aboutus.jpg" },
  { name: "Michael Brown", role: "Marketing Head", image: "aboutus.jpg" },
  { name: "Olivia Wilson", role: "Software Engineer", image: "aboutus.jpg" },
];

const OurTeam = () => {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3, // Show 3 cards at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } }, // Show 2 cards on medium screens
      { breakpoint: 600, settings: { slidesToShow: 1 } }, // Show 1 card on small screens
    ],
  };

  return (
    <Box sx={{ py: 6, backgroundColor: "#f5f5f5", mt: 2 }}>
      <Container>
        <Typography variant="h3" fontWeight="bold" textAlign="center" color="primary" gutterBottom>
          Meet Our Team
        </Typography>
        <Slider {...settings}>
          {teamMembers.map((member, index) => (
            <Box key={index} sx={{ px: 2 }}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 3,
                  mx: 1, // horizontal margin for spacing
                  ":hover": {
                    boxShadow: 10,
                    transform: "scale(1.02)",
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Avatar src={member.image} alt={member.name} sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {member.role}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Container>
    </Box>
  );
};

export default OurTeam;

import React from "react";
import { Box , Container , Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Carousel images
const slides = [
  { img: "aboutus.jpg", text: "Explore a World of Knowledge" },
  { img: "aboutus.jpg", text: "Thousands of Books at Your Fingertips" },
  { img: "aboutus.jpg", text: "Read Anytime, Anywhere" },
];

const Home = () => {
  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Box sx={{ position: "relative", height: "80vh", overflow: "hidden" }}>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              backgroundImage: `url(${slide.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "80vh",
              display: "flex",
              alignContent:"center",
              justifyContent: "center",
              color: "white",
              textAlign: "center",
              px: 2,
            }}
          >
            <Container>
              <Typography variant="h3" fontWeight="bold" sx={{ textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}>
                {slide.text}
              </Typography>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Home;

import { Box, Container, Typography, Link, Divider } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg,rgb(133, 164, 231), #292929)", // Use 'background' instead of 'bgcolor'
        color: "white",
        py: 2,
        boxShadow: 4,
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ letterSpacing: 1 }}>
          Prashant Digital Library
        </Typography>
        <Divider sx={{ bgcolor: "gray", width: "50%", mx: "auto" }} />
        <Typography variant="body2" color="gray.400">
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </Typography>
        <Typography variant="body2">
          Designed & Developed by
          <Link
            href="https://www.technoweit.com"
            target="_blank"
            color="primary"
            underline="hover"
            sx={{ fontWeight: "bold", ml: 0.5, mr: 0.5 }}
          >
            Technoweit
          </Link>
           Jalgaon
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

import { Box, Container, Typography, Link, Divider } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "#1c1c1c", color: "white", py: 4, mt: 5, boxShadow: 3 }}>
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
         Prashant Digital Library
        </Typography>
        <Divider sx={{ bgcolor: "gray", mb: 2 }} />
        <Typography variant="body2" color="gray.400">
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </Typography>
        <Typography variant="body2" mt={1}>
          Designed & Developed by 
          <Link href="https://www.tecknoweit.com" color="primary" underline="hover" sx={{ fontWeight: "bold", ml: 0.5 }}>
            Technoweit
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

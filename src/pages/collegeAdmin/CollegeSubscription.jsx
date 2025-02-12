import React from "react";
import { Container, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import CustomTable from "../../custom/CustomTable";
import { fetchBooksByCollegeId } from "../../apiCalls/BooksApi";

const LibrarySubscription = () => {
  const { UserData } = useSelector((state) => state.user);
  const collegeId = UserData?.user_id?.collegeId;
  console.log("collegeId : " , collegeId)

  // Fetch books using React Query
  const { data } = useQuery({
    queryKey: ["subscribedBooks.data", collegeId],
    queryFn: () => fetchBooksByCollegeId({ collegeId }),
  }); 

  const booksData = data?.data || [];

  console.log("Fetched Books:", booksData);
  // Define Table Columns
  const columns = [
    { header: "Sr. No", accessorFn: (row, index) => index + 1 },
    { header: "Title", accessorKey: "name" },
    { header: "Author", accessorKey: "author" },
    { header: "Category", accessorKey: "category" },
    { header: "Price (₹)", accessorKey: "price" },
    { header: "Publisher", accessorKey: "publisher" },
    {
      header: "Year Published",
      accessorKey: "yearPublished",
    },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight={550} sx={{ mb: 2 }}>
        Subscribed Books
      </Typography>

      <CustomTable data={booksData} columns={columns} enablePagination={true} pageSize={5} />
    </Container>
  );
};

export default LibrarySubscription;

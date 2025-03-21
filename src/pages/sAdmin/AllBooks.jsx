import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Container, IconButton, Tooltip } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomTable from "../../custom/CustomTable";
import { getBooks, deleteBook } from "../../apiCalls/BooksApi";
import { useAlert } from "../../custom/CustomAlert";
import { useSelector } from "react-redux";

const AllBooks = () => {
    const { UserData } = useSelector((state) => state.user);
    const { showAlert } = useAlert();
    const queryClient = useQueryClient();
    const [tabValue, setTabValue] = useState(0);
    const categories = ["All", "Science", "Commerce", "Arts", "Engineering"];
    const token = UserData.token;

    const { data: bookData = [], error } = useQuery({
        queryKey: ["books"],
        queryFn: getBooks,
    });

    const deleteMutation = useMutation({
        mutationFn: (bookId) => deleteBook({ _id: bookId , token }),
        onSuccess: () => {
            queryClient.invalidateQueries(["books"]);
            showAlert("Book deleted successfully", "success");
        },
        onError: (error) => {
            console.error("Error deleting book:", error.message);
            showAlert("Error deleting book", "error");
        },
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleDeleteBook = (bookId) => {
        deleteMutation.mutate(bookId);
    };
    if (error) return <Typography>Error loading books.</Typography>;

    const filteredBooks =
        tabValue === 0 ? bookData.data : bookData.data.filter((book) => book.category === categories[tabValue]);

    const columns = [
        { header: "Sr. No", accessorFn: (row, index) => index + 1 },
        { header: "Title", accessorKey: "name" },
        { header: "Author", accessorKey: "author" },
        { header: "Category", accessorKey: "category" },
        { header: "Price", accessorKey: "price" },
        { header: "Publisher", accessorKey: "publisher" },
        { header: "Year Published", accessorKey: "yearPublished" },
        {
            header: "Actions",
            accessorFn: (row) => row,
            Cell: ({ cell }) => (
                <Box>
                    <Tooltip title="Details">
                        <a href={`http://localhost:5000/${cell.getValue().bookPdf}`} target="_blank" rel="noopener noreferrer">
                            <EastIcon fontSize="small" />
                        </a>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteBook(cell.getValue()._id)} color="error">
                            <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" fontWeight={550} sx={{ mb: 2 }}>
                All Books
            </Typography>

            <Tabs value={tabValue} onChange={handleTabChange} aria-label="book categories" textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
                {categories.map((category) => (
                    <Tab key={category} label={category} />
                ))}
            </Tabs>

            <Box>
                <CustomTable data={filteredBooks} columns={columns} enableSelection={true} />
            </Box>
        </Container>
    );
};

export default AllBooks;

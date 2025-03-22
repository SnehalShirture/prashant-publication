import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Container, IconButton, Tooltip } from "@mui/material";
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
        { header: "Sr. No", accessorFn: (row, index) => index + 1  , size:100},
        { header: "Title", accessorKey: "name" , size:250 },
        { header: "Author", accessorKey: "author", size:150 },
        { header: "Category", accessorKey: "category" , size:100},
        { header: "Price", accessorKey: "price" , size:100},
        { header: "Publisher", accessorKey: "publisher" , size:200},
        { header: "Year Published", accessorKey: "yearPublished" , size:100},
        {
            header: "Actions",
            size:100,
            accessorFn: (row) => row,
            Cell: ({ cell }) => (
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <Tooltip title="Details">
                        <a href={`http://localhost:5000/${cell.getValue().bookPdf}`} target="_blank" rel="noopener noreferrer">
                            <MenuBookIcon />
                        </a>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteBook(cell.getValue()._id)} color="error">
                            <DeleteForeverIcon/>
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

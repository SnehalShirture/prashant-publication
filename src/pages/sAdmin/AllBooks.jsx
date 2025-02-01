import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Container, IconButton, Tooltip } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import CustomTable from "../../custom/CustomTable";
import { getBooks, deleteBook } from "../../apiCalls/BooksApi";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useAlert } from "../../custom/CustomAlert";

const AllBooks = () => {
    const { showAlert } = useAlert();
    const [tabValue, setTabValue] = useState(0);
    const [bookData, setBookData] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]); // State for selected books

    const categories = ["All", "Science", "Commerce", "Arts", "Engineering"];

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const fetchBooks = async () => {
        try {
            const response = await getBooks();
            setBookData(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDeleteBook = async (_id) => {
        try {
            await deleteBook({ _id });
            setBookData(bookData.filter((book) => book._id !== _id));
            showAlert("Book deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting book:", error.message);
            showAlert("Error deleting book", "error");
        }
    };

    useEffect(() => {
        console.log("Selected Books in AllBooks:", selectedBooks);
    }, [selectedBooks]);

    const columns = [
        { header: "Sr. No", accessorFn: (row, index) => index + 1 },
        { header: "Title", accessorKey: "name" },
        { header: "Author", accessorKey: "author" },
        { header: "Category", accessorKey: "category" },
        { header: "Price", accessorKey: "price" },
        { header: "Publisher", accessorKey: "publisher" },
        { header: "Year Published", accessorKey: "yearPublished" },
        { header: "Book Path", accessorKey: "bookPdf" },
        {
            header: "Actions",
            accessorFn: (row) => row,
            Cell: ({ cell }) => (
                <Box>
                    <Tooltip title="Details">
                        <a
                            href={`http://localhost:5000/${cell.getValue().bookPdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <EastIcon fontSize="small" />
                        </a>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            onClick={() => handleDeleteBook(cell.getValue()._id)}
                            color="error"
                        >
                            <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    const filteredBooks =
        tabValue === 0
            ? bookData
            : bookData.filter((book) => book.category === categories[tabValue]);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" fontWeight={550} sx={{ mb: 2 }}>
                All Books
            </Typography>

            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="book categories"
                textColor="primary"
                indicatorColor="primary"
                sx={{ mb: 2 }}
            >
                {categories.map((category) => (
                    <Tab key={category} label={category} />
                ))}
            </Tabs>

            <Box>
                <CustomTable
                    data={filteredBooks}
                    columns={columns}
                    enableSelection={true}
                    onSelectedBooksChange={setSelectedBooks}
                />
            </Box>
        </Container>
    );
};

export default AllBooks;

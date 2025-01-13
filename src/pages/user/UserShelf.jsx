import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CardMedia, TextField, Select, MenuItem, InputLabel, FormControl, Button, Pagination } from '@mui/material';

const books = [
    {
        name: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Classic",
        price: "9.99",
        publisher: "J.B. Lippincott & Co.",
        yearPublished: 1960,
        coverImage: "https://via.placeholder.com/200",
    },
    {
        name: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Romance",
        price: "14.99",
        publisher: "T. Egerton",
        yearPublished: 1813,
        coverImage: "https://via.placeholder.com/200",
    },
    {
        name: "Moby-Dick",
        author: "Herman Melville",
        category: "Adventure",
        price: "13.50",
        publisher: "Harper & Brothers",
        yearPublished: 1851,
        coverImage: "https://via.placeholder.com/200",
    },
    {
        name: "The Hobbit",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        price: "15.99",
        publisher: "George Allen & Unwin",
        yearPublished: 1937,
        coverImage: "https://via.placeholder.com/200",
    },
    {
        name: "War and Peace",
        author: "Leo Tolstoy",
        category: "Historical Fiction",
        price: "19.99",
        publisher: "The Russian Messenger",
        yearPublished: 1869,
        coverImage: "https://via.placeholder.com/200",
    },
    {
        name: "The Alchemist",
        author: "Paulo Coelho",
        category: "Philosophy",
        price: "11.99",
        publisher: "HarperOne",
        yearPublished: 1988,
        coverImage: "https://via.placeholder.com/200",
    },
    {
        name: "Crime and Punishment",
        author: "Fyodor Dostoevsky",
        category: "Crime",
        price: "12.50",
        publisher: "The Russian Messenger",
        yearPublished: 1866,
        coverImage: "https://via.placeholder.com/200",
    },
    {
        name: "Jane Eyre",
        author: "Charlotte Brontë",
        category: "Gothic",
        price: "10.99",
        publisher: "Smith, Elder & Co.",
        yearPublished: 1847,
        coverImage: "https://via.placeholder.com/200",
    },
    {
        name: "The Picture of Dorian Gray",
        author: "Oscar Wilde",
        category: "Philosophical Fiction",
        price: "9.99",
        publisher: "Ward, Lock & Co.",
        yearPublished: 1890,
        coverImage: "https://via.placeholder.com/200",
    },
    {
        name: "Brave New World",
        author: "Aldous Huxley",
        category: "Dystopian",
        price: "14.99",
        publisher: "Chatto & Windus",
        yearPublished: 1932,
        coverImage: "https://via.placeholder.com/200",
    },
    {
        name: "Brave New World",
        author: "Aldous Huxley",
        category: "Dystopian",
        price: "14.99",
        publisher: "Chatto & Windus",
        yearPublished: 1932,
        coverImage: "https://via.placeholder.com/200",
    },
    {
        name: "Brave New World",
        author: "Aldous Huxley",
        category: "Dystopian",
        price: "14.99",
        publisher: "Chatto & Windus",
        yearPublished: 1932,
        coverImage: "https://via.placeholder.com/200",
    },
];

const Shelf = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 4;

    // Filter books based on search query (author) and category
    const filteredBooks = books.filter(book => {
        return (
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCategory ? book.category === selectedCategory : true)
        );
    });

    // Pagination logic
    const paginatedBooks = filteredBooks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box sx={{ padding: 3 }}>
            {/* Search and Filter Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <TextField
                    label="Search Author"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ width: '60%' }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        label="Category"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Classic">Classic</MenuItem>
                        <MenuItem value="Romance">Romance</MenuItem>
                        <MenuItem value="Adventure">Adventure</MenuItem>
                        <MenuItem value="Fantasy">Fantasy</MenuItem>
                        <MenuItem value="Historical Fiction">Historical Fiction</MenuItem>
                        <MenuItem value="Philosophy">Philosophy</MenuItem>
                        <MenuItem value="Crime">Crime</MenuItem>
                        <MenuItem value="Gothic">Gothic</MenuItem>
                        <MenuItem value="Philosophical Fiction">Philosophical Fiction</MenuItem>
                        <MenuItem value="Dystopian">Dystopian</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Book Grid Section */}
            <Grid container spacing={3}>
                {paginatedBooks.map((book, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={book.coverImage}
                                alt={book.name}
                            />
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold">
                                    {book.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Author:</strong> {book.author}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Category:</strong> {book.category}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Price:</strong> ${book.price}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination Section */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={Math.ceil(filteredBooks.length / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                />
            </Box>
        </Box>
    );
};

export default Shelf;

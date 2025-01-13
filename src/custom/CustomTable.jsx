import React, { useState } from 'react';
import { Box, Button, Drawer } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';


// const data =[
//     { id: 1, name: 'John', age: 25 },
//     { id: 2, name: 'Jane', age: 30 },
//     { id: 3, name: 'Bob', age: 35 },
//     { id: 4, name: 'Alice', age: 40 },
// ]
// console.log(data)

const CustomTable = ({ data = [], columns = [], AddComponent }) => {
    const [open, setOpen] = useState(false);
    // const [tableData, setTableData] = useState(data); // State for user login data
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const table = useMaterialReactTable({
        columns,
        data: data, // Display the user login data
        enableRowSelection: true, // Allow row selection
        positionToolbarAlertBanner: 'bottom',
        enableFullScreenToggle: false,
        enableColumnActions: false,
        enableSorting: true,
        enableColumnVisibilityToggle: false,
        enableDensityToggle: false,
        defaultDisplayColumn: {
            minSize: 40,
        },
        initialState: { density: 'compact', showGlobalFilter: true },
        // muiTableBodyRowProps: ({ row }) => ({
        //     sx: {
        //         backgroundColor: row.original.isActive ? '#e8f5e9' : '#ffebee', // Highlight active/inactive users
        //         cursor: "pointer",
        //     },
        // }),
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                    mb: 1,
                }}
            >
            </Box>
        ),
    });

    const handleCloseDrawer = () => {
        setOpen(false);
    };

    return (
        <Box>
            <MaterialReactTable table={table} />
            <Drawer
                open={open}
                onClose={toggleDrawer(false)}
                anchor='right'
                elevation={5}
                transitionDuration={{ enter: 225, exit: 195 }}
                sx={{
                    '& .MuiDrawer-paper': {
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                    },
                }}
            >
                {/* <Box sx={{ width: 400, height: "100%", bgcolor: "#f5f5f5", p: 2 }}>
                    {React.cloneElement(AddComponent, { handleCloseDrawer: handleCloseDrawer })}
                </Box> */}
            </Drawer>
        </Box>
    );
};

export default CustomTable;

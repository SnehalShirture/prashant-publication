import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const CustomTable = ({ data = [], columns = [], enableSelection = false, onSelectedBooksChange }) => {
    const [rowSelection, setRowSelection] = useState({});

    // Effect to notify parent component about selected books
    useEffect(() => {
        if (enableSelection && onSelectedBooksChange) {
            const selectedBooks = Object.keys(rowSelection).map((key) => data[key]);
            onSelectedBooksChange(selectedBooks);
        }
    }, [rowSelection, data, enableSelection, onSelectedBooksChange]);

    // Configure the table
    const table = useMaterialReactTable({
        columns,
        data,
        enableRowSelection: enableSelection,
        onRowSelectionChange: setRowSelection,
        state: { rowSelection },
        positionToolbarAlertBanner: "bottom",
        enableFullScreenToggle: false,
        enableColumnActions: false,
        enableSorting: true,
        enableColumnVisibilityToggle: false,
        enableDensityToggle: false,
        defaultDisplayColumn: { minSize: 40 },
        initialState: { density: "compact", showGlobalFilter: true },
    });

    return (
        <Box>
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default CustomTable;
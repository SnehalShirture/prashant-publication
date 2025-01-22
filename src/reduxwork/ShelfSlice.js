import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shelves: [],
};

const shelfSlice = createSlice({
  name: "shelf",
  initialState,
  reducers: {
    addShelf: (state, action) => {
        const newShelf = action.payload;
        state.shelves = [...state.shelves ,newShelf ]
    },
    removeShelf: (state, action) => {
      state.shelves = state.shelves.filter((shelf) => shelf.id !== action.payload); // Removes a shelf by its id
    },
  },
});

export const { addShelf, removeShelf } = shelfSlice.actions;

export default shelfSlice.reducer;

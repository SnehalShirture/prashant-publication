import { createInstance } from "./axiosInstance";
import axios from "axios";

axios.defaults.withCredentials = true;

// Add new Book
export const addnewbook = async (formData) => {
  let aInstance = createInstance()
  console.log(formData)
  try {
    const response = await aInstance.post("addBook", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error adding book:", error.message);
    throw new Error(error.response?.data?.message || "An error occurred during  adding book");
  }
}

//Get All Books
export const getBooks = async () => {
  let aInstance = createInstance()
  try {
    const response = await aInstance.get("getBook");
    return response.data;
  } catch (error) {
    console.log("Error getting books:", error.message);
    throw new Error(error.response?.data?.message || "An error occurred during getting books");
  }
};

//delete book
export const deleteBook = async (reqdeldata) => {
  const aInstance = createInstance(); // Ensure `createInstance` initializes Axios.
  try {
    const response = await aInstance.post('deleteBook', reqdeldata); // Use DELETE with ID in the URL.
    return response.data; // Return the response data.
  } catch (error) {
    console.error("Error deleting book:", error.message);
    throw new Error(error.response?.data?.message || "An error occurred while deleting the book");
  }
};
//book add to shelf
export const addToShelf = async (data, token) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("addToShelf", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error adding to shelf:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while adding to shelf"
    );
  }
};

//remove book from shelf
export const bookRemoveFromShelf = async (data, token) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("deleteBookFromShelfByUserId", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
        });
        console.log(response);
        return response.data;
    
  } catch (error) {
    console.error("Error removing from shelf:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while removing from shelf"
      );
    
  }
}

//fetch shelf books 
export const fetchShelfBooks = async (user , token) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("bookShelf", user, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
        });
    return response.data;
  } catch (error) {
    console.error("Error fetching shelf books:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while fetching shelf books."
    );
  }
};

//fetch books by college id
export const fetchBooksByCollegeId = async (collegeId) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("getBooksByCollegeId", collegeId );
    return response.data;
    
  } catch (error) {
    console.error("Error fetching books by college id:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while fetching books by college id."
      );
    
  }
}


//start book reading counter
export const startBookReadingCounter = async ({bookId, collegeId}) => {
  const aInstance = createInstance();
  try {
    console.log(" req data ", {bookId, collegeId})
    const response = await aInstance.post("StartReadingSession", {bookId, collegeId} );
    return response.data;
    
  } catch (error) {
    console.error("Error starting book reading counter:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while starting book reading counter."
      );
    
  }
}

//stop book reading counter 
export const stopBookReadingCounter = async ({bookId, collegeId}) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("stopReadingSession", {bookId, collegeId})
    return response.data;
    
  } catch (error) {
    console.error("Error stopping book reading counter:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while stopping book reading counter."
      );
  }
}

// fetch books for user 
export const fetchBooksForUser = async (collegeId) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("fetchBooksByCollegeId", collegeId);
    console.log("response : " , response)
    return response.data;
    
  } catch (error) {
    console.error("Error fetching books for user:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while fetching books for user."
      );
    
  }
}

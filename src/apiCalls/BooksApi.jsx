import { createInstance } from "./axiosInstance";
import axios from "axios";

axios.defaults.withCredentials = true;

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
export const deleteBook = async (reqdeldata) => {
  const aInstance = createInstance(); // Ensure `createInstance` initializes Axios.
  try {
    console.log("Deleting book with ID:", reqdeldata);
    const response = await aInstance.post('deleteBook', reqdeldata); // Use DELETE with ID in the URL.
    return response.data; // Return the response data.
  } catch (error) {
    console.error("Error deleting book:", error.message);
    throw new Error(error.response?.data?.message || "An error occurred while deleting the book");
  }
};

export const addToShelf = async (data, token) => {
  const aInstance = createInstance();
  try {
    console.log("Data:", data);
    console.log("Token:", token); 
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


export const fetchShelfBooks = async (user) => {
  const aInstance = createInstance();
  try {
    console.log("Request data:", user);
    const response = await aInstance.post("/bookShelf", user); 
    return response.data;
  } catch (error) {
    console.error("Error fetching shelf books:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while fetching shelf books."
    );
  }
};


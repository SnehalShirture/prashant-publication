import { createInstance } from "./axiosInstance";
import axios from "axios";

axios.defaults.withCredentials = true;

export const addbook = async (formData) => {
    let aInstance = createInstance()
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

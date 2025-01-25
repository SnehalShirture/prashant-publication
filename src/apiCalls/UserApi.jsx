import axios from "axios";
import { createInstance } from "./axiosInstance";

// axios.defaults.withCredentials = true;

// const BASE_URL = "mongodb+srv://prashantbooks2025:kvPiegjdlRsOLBxA@prashant.0d7z5.mongodb.net/?retryWrites=true&w=majority&appName=Prashant";

export const registeruser = async (userReqData) => {
    let aInstance = createInstance()
    try {
        const response = await aInstance.post("register", userReqData, { headers: { "Content-Type": "application/json" } });
        console.log(response)
        return response.data;

    } catch (error) {
        // Log the full error response for debugging
        console.log("Registration Error:", error.message);
        throw new Error(error.response?.data?.message || "An error occurred during registration.");

    }
}
export const loginuser = async (reqLoginData) => {
    let aInstance = createInstance()
    console.log(reqLoginData)
    try {
        const response = await aInstance.post("login", reqLoginData);
        return response.data; // Return the successful response data
    } catch (error) {
        // Improved error handling
        const errorMessage = error.response?.data?.message || "An error occurred during login.";
        console.error("Error Response:", errorMessage);
        throw new Error(errorMessage); // Throw a clear error message
    }
};
export const userlogout = async (reqLogout) => {
    let aInstance = createInstance()
    try {
        console.log("Logging out with data:", reqLogout);
        const response = await aInstance.post("logout", reqLogout);
        console.log(response)
        return response.data;
    } catch (error) {
        // Log the full error response for debugging
        console.error("Logout Error:", error.response?.data);
        throw new Error(error.response?.data?.message || "An error occurred during logout.");
    }
}

export const sendotp = async (data) => {
    let aInstance = createInstance()
    try {
        const response = await aInstance.post("sendOTP", data);
        return response.data;

    } catch (error) {
        console.error("Error Response:", error.response?.data);
        throw new Error(error.response?.data?.message || "An error occurred during OTP sending.");

    }
};

export const resetPassword = async (data) => {
    let aInstance = createInstance()
   try {
    const response = await aInstance.post("resetPassword", data);
    return response.data;
    
   } catch (error) {
    console.error("Error Response:", error.response?.data);
    throw new Error(error.response?.data?.message || "An error occurred during password reset.");
    
   }
  };

  export const getreadingdatabytuserid = async(getreqdata) =>{
    let aInstance = createInstance()
    console.log(getreqdata)
    try {
        const response = await aInstance.post("getUserReadData" , getreqdata);
        return response.data;
    } catch (error) {
        console.error("Error Response:", error.response?.data);
        throw new Error(error.response?.data?.message || "An error occurred during reading data retrieval.");

    }
  }


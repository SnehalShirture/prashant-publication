import { createInstance } from "./axiosInstance";
import axios from "axios";

const aInstance = createInstance();

// create Package
export const createPackage = async(reqpackagedata)=>{
    console.log(" reqpackagedata : " , reqpackagedata )
   try {
    const response = await aInstance.post("createPackage" , reqpackagedata)
    console.log(" response : " , response.data )
    return response.data
    
   } catch (error) {
    console.log("Error adding Pachage:", error.message);
    throw new Error(error.response?.data?.message || "An error occurred during  adding package");
    
   }
}

// get All Packages 
export const fetchAllPackages = async () => {
    try {
        const response = await aInstance.get("getAllPackages");
        console.log(" response : " , response.data )
        return response.data;
        
    } catch (error) {
        console.log("Error getting all packages:", error.message);
        throw new Error(error.response?.data?.message || "An error occurred during getting all packages");

        
    }
}

//create razorpay order 
export const createRazorpayOrder = async (razorpayOrderData) => {
    try {
        const response = await aInstance.post("createRazorpayOrder", razorpayOrderData);
        console.log("createRazorpayOrder response : " , response.data )
        return response.data;
        
    } catch (error) {
        console.log("Error creating razorpay order:", error.message);
        throw new Error(error.response?.data?.message || "An error occurred during creating razorpay order");
        
    }
}
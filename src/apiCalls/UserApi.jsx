import { createInstance } from "./axiosInstance";

//register user
export const registeruser = async (userReqData) => {
    let aInstance = createInstance()
    try {
        const response = await aInstance.post("registerUser", userReqData, { headers: { "Content-Type": "application/json" } });
        console.log(response)
        return response.data;

    } catch (error) {
        // Log the full error response for debugging
        console.log("Registration Error:", error.message);
        throw new Error(error.response?.data?.message || "An error occurred during registration.");

    }
}
//activateUser
export const activateUser = async (userReqData) => {
    let aInstance = createInstance()
    try {
        const response = await aInstance.post("activateUser", userReqData, { headers: {
            "Content-Type": "application/json"
            } });
            console.log(response)
            return response.data;
        
    } catch (error) {
        // Log the full error response for debugging
        console.log("Activation Error:", error.message);
        throw new Error(error.response?.data?.message || "An error occurred during activation.");
        
    }
}

//uploadBulkStudents 
export const uploadBulkStudents = async (studentReqData) => {
    let aInstance = createInstance()
    try {
        const response = await aInstance.post("uploadBulkStudents", studentReqData, 
            { headers:
            { "Content-Type": "application/json" } 
            });
            console.log(response)
            return response.data;
        
    } catch (error) {
        // Log the full error response for debugging
        console.log("Upload Bulk Students Error:", error.message);
        throw new Error(error.response?.data?.message || "An error occurred during uploading bulk students.");

        
    }
}

//login user
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

//logout user
export const userlogout = async (reqLogout) => {
    let aInstance = createInstance()
    try {
        console.log("Logging out with data:", reqLogout);
        const response = await aInstance.post("logout", reqLogout);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Logout Error:", error.response?.data);
        throw new Error(error.response?.data?.message || "An error occurred during logout.");
    }
}

//send otp 
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

//reset new password
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

  //get book reading data by user id
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

  //fetch student data by college id
export const getstudentbyclgid = async(collegeId)=>{
    let aInstance = createInstance()
    console.log(collegeId)
    try {
        const response = await aInstance.post("getUserByClgId", collegeId);
        console.log(response)
        return response.data;
        
    } catch (error) {
        console.error("Error Response:", error.response?.data);
        throw new Error(error.response?.data?.message || "An error occurred during student retrieval.");
        
    }
}

//add new college
export const createCollege = async(reqClgData) =>{
    let aInstance = createInstance()
    console.log("Request college data : " , reqClgData)
    try {
        const response = await aInstance.post("addCollege" , reqClgData);
        return response.data;
    } catch (error) {
        console.error("Error Response:", error.response?.data);
        throw new Error(error.response?.data?.message || "An error occurred during College creation.");
    }
} 

//fetch college data
export const getColleges = async () => {
    let aInstance = createInstance()
    try {
      const response = await aInstance.get("fetchCollegeData");
      console.log(response)
      return response.data;
    } catch (error) {
        console.error("Error Response:", error.response?.data);
        throw new Error(error.response?.data?.message || "An error occurred during College retrieval.");
    }
  };

//upadate password 
export const updatePassword = async (email, oldPassword, newPassword) => {
    let aInstance = createInstance()
    try {
        const response = await aInstance.post("updatePassword", {email, oldPassword, newPassword});
        return response.data;
        
    } catch (error) {
        console.error("Error Response:", error.response?.data);
        throw new Error(error.response?.data?.message || "An error occurred during password update.");  
        
    }
}
// fetch total book read data by month
export const getBookReadData = async () => {
    let aInstance = createInstance()
    try {
        const response = await aInstance.get("getTotalPagesByMonth");
        return response.data;
        
    } catch (error) {
        console.error("Error Response:", error.response?.data);
        throw new Error(error.response?.data?.message || "An error occurred during book read data retrieval");
        
    }
}
  

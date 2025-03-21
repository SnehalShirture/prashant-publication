import { createInstance } from "./axiosInstance";


//create subscription
export const createsubscription = async ({subscriptionData , token}) => {
  console.log("craete sub : " , {subscriptionData , token})
  const aInstance = createInstance();
  try {
    console.log("Data:", {subscriptionData , token});
    const response = await aInstance.post('createsubscription', subscriptionData , {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    return response.data;

  } catch (error) {
    console.error("Error creating subscription:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while creating subscription"
    );
  }
}

//get all subscriptions 
export const getAllSubscriptions = async (token) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.get('getAllSubscription' , {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;

  } catch (error) {
    console.error("Error getting all subscriptions:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while getting all subscriptions"
    );
  }
}

//update subscription status
export const updateSubscriptionStatus = async ({data , token}) => {
  const aInstance = createInstance();
  console.log("updated data: " , data , token)
  try {
    const response = await aInstance.post("updateSubscriptionStatus", data , {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating subscription status:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while updating subscription status"
    );
  }
};

//get subscription by clg id
export const getSubscriptionByClgId = async ({collegeId , token}) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("getSubscriptionByCollegeId",{collegeId}  , {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      return response.data;
    
  } catch (error) {
    console.error("Error getting subscription by college id:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while getting subscription by college id"
      );
  }
}

//sendQuotation 
export const sendQuotation = async ({ email, pdfurl, token }) => {
  const aInstance = createInstance();
  console.log("data : " , { email, pdfurl, token } )
  try {
    const response = await aInstance.post("sendQuotation", {email, pdfurl} , {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
    
  } catch (error) {
    console.error("Error sending quotation:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while sending quotation"
      );
  }
}

//generateQuotationpdf
export const generateQuotationpdf = async ({subscriptionId , token}) => {
  const aInstance = createInstance();
  console.log("data : " ,subscriptionId , token )
  try {
    const response = await aInstance.post("generateQuotationpdf", {subscriptionId} , {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
    
  } catch (error) {
    console.error("Error generating quotation pdf:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while generating quotation pdf"
    );
    
  }
}

//updateSubscriptionQuotation
export const updateSubscriptionQuotation = async (quotationData) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("updateSubscriptionQuotation", quotationData);
    console.log("quotationData :" , quotationData)
    return response.data;
    
  } catch (error) {
    console.error("Error updating subscription quotation:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while updating subscription quotation"
      );
    
  }
}

//get notifications 
export const getNotifications = async ({collegeId}) => {
  const aInstance = createInstance();
  console.log("collegeId : " , collegeId)
  try {
    const response = await aInstance.get("getNotification" , collegeId);
    return response.data;
    
  } catch (error) {
    console.error("Error getting notifications:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while getting notifications"
      );
    
  }
}
import { createInstance } from "./axiosInstance";


//create subscription
export const createsubscription = async (subData) => {
  const aInstance = createInstance();
  try {
    console.log("Data:", subData);
    const response = await aInstance.post('createsubscription', subData);
    return response.data;

  } catch (error) {
    console.error("Error creating subscription:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while creating subscription"
    );
  }
}

//get all subscriptions 
export const getAllSubscriptions = async () => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.get('getAllSubscription');
    return response.data;

  } catch (error) {
    console.error("Error getting all subscriptions:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while getting all subscriptions"
    );
  }
}

//update subscription status
export const updateSubscriptionStatus = async (data) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("updateSubscriptionStatus", data);
    return response.data;
  } catch (error) {
    console.error("Error updating subscription status:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while updating subscription status"
    );
  }
};

//get subscription by clg id
export const getSubscriptionByClgId = async (collegeId) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("getSubscriptionByCollegeId",collegeId )
      return response.data;
    
  } catch (error) {
    console.error("Error getting subscription by college id:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while getting subscription by college id"
      );
  }
}

//sendQuotation 
export const sendQuotation = async (quotationData) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("sendQuotation", quotationData);
    return response.data;
    
  } catch (error) {
    console.error("Error sending quotation:", error.message);
    throw new Error(
      error.response?.data?.message || "An error occurred while sending quotation"
      );
  }
}

//generateQuotationpdf
export const generateQuotationpdf = async (quotationData) => {
  const aInstance = createInstance();
  try {
    const response = await aInstance.post("generateQuotationpdf", quotationData);
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

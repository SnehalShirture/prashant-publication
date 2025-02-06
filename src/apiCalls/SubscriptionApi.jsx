import { createInstance } from "./axiosInstance";


//create subscription
export const createsubscription = async(subData) =>{
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
export const getAllSubscriptions = async() =>{
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
export const updateSubscriptionStatus = async ({ subscriptionId, status }) => {
    const aInstance = createInstance();
    try {
      const response = await aInstance.post("updateSubscriptionStatus", { subscriptionId, status });
      return response.data;
    } catch (error) {
      console.error("Error updating subscription status:", error.message);
      throw new Error(
        error.response?.data?.message || "An error occurred while updating subscription status"
      );
    }
  };
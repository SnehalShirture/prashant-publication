import axios from "axios";

export const createInstance = () => {
    let Base_URL = "http://localhost:5000/api/"

    let mInstance = axios.create({
        baseURL: Base_URL,

    })
    return mInstance
}
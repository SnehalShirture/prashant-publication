import mongoose from "mongoose";
let ATLAS_URL="mongodb+srv://prashantbooks2025:kvPiegjdlRsOLBxA@prashant.0d7z5.mongodb.net/?retryWrites=true&w=majority&appName=Prashant"

const ConnectDB = async()=>{
    const connection = await mongoose.connect(
        ATLAS_URL
    );
    console.log(connection.connection.name);
}

export {ConnectDB}

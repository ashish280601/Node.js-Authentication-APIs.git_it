// step to connect with mongoose
// 1. import the mongoose
// 2. create a function to connect with server using connect inbuilt functionality
// 3. attach the cluster to the mongoose
import mongoose from "mongoose";
import "../../env.js";

const HOST_URL = process.env.URL;

const mongooseConnectToDB = async() => {
    try {
        await mongoose.connect(HOST_URL,{dbName: 'authentication'});
        console.log("Mongoose is connected with database");
    } catch (error) {
        console.log(error);
    }
}

export default mongooseConnectToDB;
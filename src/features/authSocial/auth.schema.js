import mongoose from "mongoose";

const authShcema = new mongoose.Schema({
    googleID:{
        type: String
    },
    facebookID:{
        type: String
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    name:{
        type: String
    }
});

const authModel = mongoose.model("auth", authShcema);

export default authModel
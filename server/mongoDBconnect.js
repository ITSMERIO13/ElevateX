import mongoose from "mongoose";

const connectDB = async() => {
    const mongo_url = process.env.MONGO_DB_URL;
    console.log("Mongo URL", mongo_url);
    
    await mongoose.connect(mongo_url)
    .then(()=>{
        console.log("MongoDB connected successfully");
    })
    .catch((err)=>{
        console.log("Error connecting to MongoDB",err);
    })

}

export default connectDB;  
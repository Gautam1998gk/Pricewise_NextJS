import mongoose from "mongoose";

let isConected = false

export const connectToDB=async()=>{
 mongoose.set("strictQuery",true)
 if(!process.env.DATABASE_URI) return console.log("Mongoose Uri required");
 if(isConected) return console.log("using existing data base");
 
 try {
    
 await mongoose.connect(process.env.DATABASE_URI)
 isConected =true
 console.log("DB connected");
 
 } catch (error) {
    console.log(error);
    
 }
}
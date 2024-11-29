import mongoose from "mongoose";

//connect mondoDB
const connectDB = async () => {
  mongoose.connection.on("connected", () => {

    console.log("Connected to MongoDB 🦄");
  });
  await mongoose.connect(`${process.env.MONGODB_URI}`);
};

export default connectDB;

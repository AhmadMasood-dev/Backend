import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionString = `${process.env.MONGODB_URL}/${DB_NAME}`;

    const connectionInstance = await mongoose.connect(connectionString);
    console.log("MongoDb connected !! ", connectionInstance.connection.host);
  } catch (error) {
    console.log("MongoDb connection error", error);
    process.exit(1);
  }
};

export default connectDB;

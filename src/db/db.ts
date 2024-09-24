import dotenv from "dotenv";
import { mongoUri } from "../config";
import mongoose from "mongoose";

dotenv.config();

const dbName = "minigram";
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`;

export async function runDb() {
  try {
    await mongoose.connect(mongoURI);
    console.log("it is ok");
  } catch (e) {
    console.log("no connection");
    await mongoose.disconnect();
  }
}

console.log(mongoUri);

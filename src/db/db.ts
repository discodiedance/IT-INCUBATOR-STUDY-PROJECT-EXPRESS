import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { BlogType } from "../types/blog/output";
import { PostType } from "../types/post/output";

dotenv.config();

export const port = 3000;

const mongoUri = process.env.MONGO_URL || "mongodb://localhost:27017";

const client = new MongoClient(mongoUri);

const db = client.db("node-blog");

export const blogCollection = db.collection<BlogType>("blog");
export const postCollection = db.collection<PostType>("post");

export const runDb = async () => {
  try {
    await client.connect();
    console.log("Client connected to DB");
    console.log(`Example app listening on port ${port}`);
  } catch (e) {
    console.log(`"${e}"`);
    await client.close();
  }
};

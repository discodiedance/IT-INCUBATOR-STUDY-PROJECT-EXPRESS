import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { BlogType } from "../types/blog/output";
import { PostType } from "../types/post/output";
import { UserType } from "../types/user/output";
import { AuthType } from "../types/auth/input";

dotenv.config();

const mongoUri = process.env.MONGO_URL as string;

console.log(mongoUri);

const client = new MongoClient(mongoUri);

const db = client.db("minigram");

export const blogCollection = db.collection<BlogType>("blogs");
export const postCollection = db.collection<PostType>("posts");
export const userCollection = db.collection<UserType>("users");
export const authCollection = db.collection<AuthType>("login");

export const runDb = async () => {
  try {
    await client.connect();
    console.log("Client connected to DB");
  } catch (e) {
    console.log(`"${e}"`);
    await client.close();
  }
};

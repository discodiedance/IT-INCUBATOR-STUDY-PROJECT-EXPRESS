import { MongoClient } from "mongodb";
import { BlogType } from "../types/blog/output";
import { PostType } from "../types/post/output";
<<<<<<< HEAD
import { UserDBType } from "../types/user/output";
=======
import { UserDBType, UserType } from "../types/user/output";
>>>>>>> a1a9fe719e0e78ae31822c7ab8155defc0236737
import { CommentType } from "../types/comment/output";
import { mongoUri } from "../config";

console.log(mongoUri);

const client = new MongoClient(mongoUri);

const db = client.db("minigram");

export const blogCollection = db.collection<BlogType>("blogs");
export const postCollection = db.collection<PostType>("posts");
export const userCollection = db.collection<UserDBType>("users");
export const commentCollection = db.collection<CommentType>("comments");

export const runDb = async () => {
  try {
    await client.connect();
    console.log("Client connected to DB");
  } catch (e) {
    console.log(`"${e}"`);
    await client.close();
  }
};

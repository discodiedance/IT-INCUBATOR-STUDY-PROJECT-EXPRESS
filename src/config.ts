import dotenv from "dotenv";
dotenv.config();

export const mongoUri = process.env.MONGO_URL as string;
export const JWT_SECRET = process.env.JWT_SECRET || "123";

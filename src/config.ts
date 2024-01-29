import dotenv from "dotenv";
dotenv.config();

export const mongoUri = process.env.MONGO_URL as string;
<<<<<<< HEAD
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const MAIL_RU_PASS = process.env.MAIL_RU_PASS;
=======
export const JWT_SECRET = process.env.JWT_SECRET || "123";
export const MAIL_RU_PASS = "0aR1BKBaNKkfd3XgVkEw";
>>>>>>> a1a9fe719e0e78ae31822c7ab8155defc0236737

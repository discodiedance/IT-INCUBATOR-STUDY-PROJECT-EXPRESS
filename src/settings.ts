import express from "express";
import cookieParser from "cookie-parser";
import { postRoute } from "./routes/post-route";
import { blogRoute } from "./routes/blog-route";
import { testingRoute } from "./routes/testing-route";
import { userRoute } from "./routes/user-route";
import { authRoute } from "./routes/auth-route";
import { commentRoute } from "./routes/comment-route";
import { securityRoute } from "./routes/security-route";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/testing", testingRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/blogs", blogRoute);
app.use("/posts", postRoute);
app.use("/comments", commentRoute);
app.use("/security", securityRoute);

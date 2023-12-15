import express from "express";

import { postRoute } from "./routes/post-route";
import { blogRoute } from "./routes/blog-route";
import { testingRoute } from "./routes/testing-route";
import { userRoute } from "./routes/user-route";
import { authRoute } from "./routes/auth-route";

export const app = express();
app.use(express.json());

app.use("/testing", testingRoute);
app.use("/login", authRoute);
app.use("/users", userRoute);
app.use("/blogs", blogRoute);
app.use("/posts", postRoute);

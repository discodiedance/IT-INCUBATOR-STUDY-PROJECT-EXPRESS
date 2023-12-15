import express from "express";

import { postRoute } from "./routes/post-route";
import { blogRoute } from "./routes/blog-route";
import { testingRoute } from "./routes/testing-route";
import { userRoute } from "./routes/user-route";

export const app = express();
app.use(express.json());

app.use("/testing", testingRoute);

app.use("/blogs", blogRoute);
app.use("/posts", postRoute);
app.use("/users", userRoute);

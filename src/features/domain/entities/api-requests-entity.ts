import mongoose from "mongoose";
import { APIReqeustsType } from "../../../types/common";

export const APIRequestsSchema = new mongoose.Schema<APIReqeustsType>({
  ip: { type: String, require: true },
  URL: { type: String, require: true },
  title: { type: String, require: true },
  date: { type: Date, require: true },
});

export const APIRequeststModel = mongoose.model<APIReqeustsType>(
  "api-requests",
  APIRequestsSchema
);

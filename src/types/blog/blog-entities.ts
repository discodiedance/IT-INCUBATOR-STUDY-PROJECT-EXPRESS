import { HydratedDocument, Model } from "mongoose";
import { BlogDBType, CreateBlogDataType, UpdateBlogDataType } from "./blog-dto";

export type BlogDBMethodsType = {
  updateBlog: (updateData: UpdateBlogDataType) => void;
};

type BlogModelWithMethodsType = Model<BlogDBType, {}, BlogDBMethodsType>;

type BlogModelStaticType = Model<BlogDBType> & {
  createBlog(newBlog: CreateBlogDataType): BlogDocumentType;
};

export type BlogModelFullType = BlogModelWithMethodsType & BlogModelStaticType;

export type BlogDocumentType = HydratedDocument<BlogDBType, BlogDBMethodsType>;

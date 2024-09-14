import { BlogModel } from "../../db/db";
import { blogMapper } from "../../middlewares/blog/blog-mapper";
import { BlogSortDataType } from "../../types/blog/input";
import { BlogDBType, OutputBlogType } from "../../types/blog/output";

export class QueryBlogRepository {
  async getAllBlogs(sortData: BlogSortDataType) {
    const sortDirection = sortData.sortDirection ?? "desc";
    const sortBy = sortData.sortBy ?? "createdAt";
    const searchNameTerm = sortData.searchNameTerm ?? null;
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;

    let filter = {};

    if (searchNameTerm) {
      filter = {
        name: {
          $regex: searchNameTerm,
          $options: "i",
        },
      };
    }

    const blogs = await BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount = await BlogModel.countDocuments(filter);
    const pageCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: blogs.map(blogMapper),
    };
  }

  async getBlogById(id: string): Promise<OutputBlogType | null> {
    const blog: BlogDBType | null = await BlogModel.findOne({ id: id });
    if (!blog) {
      return null;
    }
    return blogMapper(blog);
  }
}

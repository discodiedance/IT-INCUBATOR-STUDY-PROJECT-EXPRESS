import { injectable } from "inversify";

import { OutputBlogType } from "../../../../types/blog/output";
import { BlogModel } from "../../../domain/entities/blog-entity";
import { BlogDocumentType } from "../../../../types/blog/blog-entities";
import { BlogSortDataType } from "../../../../types/blog/blog-dto";
import { blogMapper } from "../../../application/mappers/blog/blog-mapper";

@injectable()
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
      .limit(+pageSize);

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

  async getMappedBlogById(id: string): Promise<OutputBlogType | null> {
    const blog = await BlogModel.findOne({ id: id });
    if (!blog) {
      return null;
    }
    return blogMapper(blog);
  }
}

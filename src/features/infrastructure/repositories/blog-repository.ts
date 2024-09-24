import { injectable } from "inversify";
import { BlogModel } from "../../domain/entities/blog-entity";
import { BlogDocumentType } from "../../../types/blog/blog-entities";

@injectable()
export class BlogRepository {
  async save(model: BlogDocumentType) {
    return await model.save();
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await BlogModel.deleteOne({ id: id });

    return !!result.deletedCount;
  }

  async getBlogByBlogId(id: string): Promise<BlogDocumentType | null> {
    const blog = await BlogModel.findOne({ id: id });
    if (!blog) {
      return null;
    }
    return blog;
  }
}

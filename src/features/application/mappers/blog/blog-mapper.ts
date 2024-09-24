import { BlogDocumentType } from "../../../../types/blog/blog-entities";
import { OutputBlogType } from "../../../../types/blog/output";

export const blogMapper = (blog: BlogDocumentType): OutputBlogType => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

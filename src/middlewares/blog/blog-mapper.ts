import { BlogDBType, OutputBlogType } from "../../types/blog/output";

export const blogMapper = (blog: BlogDBType): OutputBlogType => {
  return {
    blogId: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

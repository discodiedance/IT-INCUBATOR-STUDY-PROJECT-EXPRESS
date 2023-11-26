import { BlogType, OutputBlogType } from "../../types/blog/output";
import { WithId } from "mongodb";

export const blogMapper = (blog: WithId<BlogType>): OutputBlogType => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

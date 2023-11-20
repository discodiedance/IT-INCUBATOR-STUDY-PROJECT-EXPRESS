import { DBType } from "../types/common";

export const db: DBType = {
  videos: [
    {
      id: 1,
      title: "string",
      author: "string",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: "2023-11-08T12:16:55.998Z",
      publicationDate: "2023-11-08T12:16:55.998Z",
      availableResolutions: ["P144"],
    },
  ],
  blogs: [
    {
      id: "string",
      name: "string",
      description: "string",
      websiteUrl: "string",
    },
  ],
  posts: [
    {
      id: "string",
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: "string",
      blogName: "string",
    },
  ],
};

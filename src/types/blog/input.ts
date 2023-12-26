export type BlogBody = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type UpdateBlogData = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type InputBlogType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogSortDataType = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
  blogId?: string;
};

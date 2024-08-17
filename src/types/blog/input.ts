export type InputBlogBodyType = {
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

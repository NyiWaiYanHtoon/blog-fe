import api from "./axios";

export const getBlogs = (page = 1, search = "") =>
  api.get("/blogs", { params: { page, search } });

export const getBlogBySlug = (slug) =>
  api.get(`/blogs/${slug}`);

export const getBlogComments = (slug) =>
  api.get(`/blogs/${slug}/comments`);

export const submitComment = (slug, data) =>
  api.post(`/blogs/${slug}/comments`, data);
import api from "./axios";

// Blogs
export const adminGetBlogs = () =>
  api.get("/admin/blogs");

export const adminGetBlogById = (id) =>
  api.get(`/admin/blogs/${id}`);

export const adminCreateBlog = (data) =>
  api.post("/admin/blogs", data);

export const adminUpdateBlog = (id, data) =>
  api.put(`/admin/blogs/${id}`, data);

export const adminDeleteBlog = (id) =>
  api.delete(`/admin/blogs/${id}`);

export const adminPublishBlog = (id) =>
  api.patch(`/admin/blogs/${id}/publish`);

export const adminUnpublishBlog = (id) =>
  api.patch(`/admin/blogs/${id}/unpublish`);

// Comments
export const adminGetComments = (status) =>
  api.get("/admin/comments", { params: status ? { status } : {} });

export const adminApproveComment = (id) =>
  api.patch(`/admin/comments/${id}/approve`);

export const adminRejectComment = (id) =>
  api.patch(`/admin/comments/${id}/reject`);

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

import BlogListPage from "../pages/BlogListPage";
import BlogDetailPage from "../pages/BlogDetailPage";
import LoginPage from "../pages/LoginPage";

import DashboardPage from "../pages/admin/DashboardPage";
import BlogManagementPage from "../pages/admin/BlogManagementPage";
import CreateBlogPage from "../pages/admin/CreateBlogPage";
import EditBlogPage from "../pages/admin/EditBlogPage";
import CommentManagementPage from "../pages/admin/CommentManagementPage";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Admin — protected by AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="blogs" element={<BlogManagementPage />} />
            <Route path="blogs/create" element={<CreateBlogPage />} />
            <Route path="blogs/:id/edit" element={<EditBlogPage />} />
            <Route path="comments" element={<CommentManagementPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
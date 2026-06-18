import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BookCheck,
  FileEdit,
  Eye,
  Clock,
  MessageSquareCheck,
  PlusCircle,
  Bell,
  LogOut,
} from "lucide-react";
import { adminGetBlogs } from "../../services/adminApi";
import { adminGetComments } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogsRes, commentsRes] = await Promise.all([
        adminGetBlogs(),
        adminGetComments(),
      ]);
      setBlogs(blogsRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.is_published).length;
  const draftBlogs = totalBlogs - publishedBlogs;
  const totalViews = blogs.reduce((sum, b) => sum + b.view_count, 0);
  const pendingComments = comments.filter((c) => c.status === "pending").length;
  const approvedComments = comments.filter(
    (c) => c.status === "approved",
  ).length;

  const stats = [
    {
      label: "Total blogs",
      value: totalBlogs,
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Published",
      value: publishedBlogs,
      icon: <BookCheck className="w-5 h-5" />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Drafts",
      value: draftBlogs,
      icon: <FileEdit className="w-5 h-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total views",
      value: totalViews.toLocaleString(),
      icon: <Eye className="w-5 h-5" />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Pending comments",
      value: pendingComments,
      icon: <Clock className="w-5 h-5" />,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Approved comments",
      value: approvedComments,
      icon: <MessageSquareCheck className="w-5 h-5" />,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-navy/5 rounded-xl">
            <LayoutDashboard className="w-5 h-5 text-navy" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Welcome back,{" "}
              <span className="text-gray-600 font-medium">
                {user?.username ?? "Admin"}
              </span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-navy text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-100 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-400">{stat.label}</p>
              <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/blogs/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-navy text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            New blog
          </Link>
          <Link
            to="/admin/comments?status=pending"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-navy text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Bell className="w-4 h-4" />
            Review comments
            {pendingComments > 0 && (
              <span className="ml-1 text-red-500 bg-yellow-100 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {pendingComments}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Recent blogs */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Recent blogs
        </h2>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                  Title
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400">
                  Views
                </th>
              </tr>
            </thead>
            <tbody>
              {blogs.slice(0, 5).map((blog) => (
                <tr
                  key={blog.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-stone-50 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-navy">
                    {blog.title}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        blog.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {blog.is_published ? (
                        <BookCheck className="w-3 h-3" />
                      ) : (
                        <FileEdit className="w-3 h-3" />
                      )}
                      {blog.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-gray-500">
                    <span className="inline-flex items-center justify-end gap-1">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      {blog.view_count.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

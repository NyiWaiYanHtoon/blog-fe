import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  Globe,
  GlobeLock,
  Loader2,
} from "lucide-react";
import {
  adminGetBlogs,
  adminDeleteBlog,
  adminPublishBlog,
  adminUnpublishBlog,
} from "../../services/adminApi";

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await adminGetBlogs();
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (blog) => {
    try {
      setTogglingId(blog.id);
      if (blog.is_published) {
        await adminUnpublishBlog(blog.id);
      } else {
        await adminPublishBlog(blog.id);
      }
      // no refetch yet, instant ui update
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blog.id ? { ...b, is_published: !b.is_published } : b,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    try {
      await adminDeleteBlog(deletingId);
      setBlogs((prev) => prev.filter((b) => b.id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
    }
  };

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Blogs</h1>
          <p className="text-sm text-gray-400 mt-1">{blogs.length} total</p>
        </div>
        <Link
          to="/admin/blogs/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-navy text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New blog
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                Title
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                Slug
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                Status
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400">
                Views
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="border-b border-gray-50 last:border-0 hover:bg-stone-50 transition-colors"
              >
                <td className="px-5 py-3 font-medium text-navy max-w-[200px] truncate">
                  {blog.title}
                </td>
                <td className="px-5 py-3 text-gray-400 font-mono text-xs max-w-[140px] truncate">
                  {blog.slug}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      blog.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {blog.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right text-gray-500">
                  <span className="inline-flex items-center justify-end gap-1">
                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                    {blog.view_count.toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {/* Publish / Unpublish */}
                    <button
                      onClick={() => togglePublish(blog)}
                      disabled={togglingId === blog.id}
                      title={blog.is_published ? "Unpublish" : "Publish"}
                      className={`p-1.5 rounded-lg transition-colors ${
                        blog.is_published
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {togglingId === blog.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : blog.is_published ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <GlobeLock className="w-4 h-4" />
                      )}
                    </button>

                    {/* Edit */}
                    <Link
                      to={`/admin/blogs/${blog.id}/edit`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => setDeletingId(blog.id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {blogs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No blogs yet.</p>
            <Link
              to="/admin/blogs/create"
              className="text-sm text-coral mt-1 inline-block hover:underline"
            >
              Create your first blog
            </Link>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl mx-4">
            <h3 className="text-base font-bold text-navy mb-2">Delete blog?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The blog and all its images will be
              permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

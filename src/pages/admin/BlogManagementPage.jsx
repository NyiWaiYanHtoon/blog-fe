import { useState } from "react";
import { Link } from "react-router-dom";
import { blogs as initialBlogs } from "../../data/DummyBlogs";
import { PlusCircle } from "lucide-react";

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState(
    initialBlogs.map((b) => ({ ...b, is_published: b.is_published ?? true })),
  );
  const [deletingId, setDeletingId] = useState(null);

  const togglePublish = (id) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, is_published: !b.is_published } : b,
      ),
    );
  };

  const confirmDelete = (id) => setDeletingId(id);

  const handleDelete = () => {
    setBlogs((prev) => prev.filter((b) => b.id !== deletingId));
    setDeletingId(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Blogs</h1>
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
                  {blog.viewCount.toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {/* Publish / Unpublish */}
                    <button
                      onClick={() => togglePublish(blog.id)}
                      title={blog.is_published ? "Unpublish" : "Publish"}
                      className={`p-1.5 rounded-lg transition-colors ${
                        blog.is_published
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>

                    {/* Edit */}
                    <Link
                      to={`/admin/blogs/${blog.id}/edit`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors"
                      title="Edit"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => confirmDelete(blog.id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
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

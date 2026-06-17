import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import { blogs } from "../../data/DummyBlogs";
import BlogForm from "../../components/blogs/BlogForm";

export default function EditBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find((b) => String(b.id) === id);

  const [slugValue, setSlugValue] = useState(blog?.slug ?? "");
  const [slugError, setSlugError] = useState("");
  const [slugSaved, setSlugSaved] = useState(false);

  if (!blog) {
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-bold text-navy mb-2">Blog not found</h2>
        <Link to="/admin/blogs" className="text-sm text-coral hover:underline">
          Back to blogs
        </Link>
      </div>
    );
  }

  const handleSubmit = async (data) => {
    // TODO: call blogApi.updateBlog(id, data)
    console.log("Update blog:", id, data);
    navigate("/admin/blogs");
  };

  const handleSlugSave = () => {
    const SLUG_REGEX = /^[a-z0-9-]+$/;
    if (!slugValue.trim()) {
      setSlugError("Slug cannot be empty.");
      return;
    }
    if (!SLUG_REGEX.test(slugValue)) {
      setSlugError("Slug may only contain lowercase letters, numbers, and hyphens.");
      return;
    }
    setSlugError("");
    setSlugSaved(true);
    setTimeout(() => setSlugSaved(false), 2000);
    // TODO: call blogApi.updateSlug(id, slugValue)
    console.log("Update slug:", slugValue);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Edit blog</h1>
          <p className="text-sm text-gray-400 mt-0.5 truncate max-w-sm">{blog.title}</p>
        </div>
      </div>

      <Link
        to="/admin/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All articles
      </Link>

      {/* Slug editor — separate panel, as per spec */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">URL Slug</h2>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                /blog/
              </span>
              <input
                value={slugValue}
                onChange={(e) => { setSlugValue(e.target.value); setSlugError(""); }}
                className={`w-full pl-14 pr-4 py-3 bg-stone-50 border rounded-xl text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 transition ${
                  slugError
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200 focus:ring-coral/30 focus:border-coral"
                }`}
              />
            </div>
            {slugError && (
              <p className="text-xs text-red-500 mt-1">{slugError}</p>
            )}
          </div>
          <button
            onClick={handleSlugSave}
            className={`shrink-0 px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
              slugSaved
                ? "bg-green-100 text-green-700"
                : "bg-navy text-white hover:bg-navy/90"
            }`}
          >
            {slugSaved ? "Saved ✓" : "Update slug"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Changing the slug will break any existing links to this article.
        </p>
      </div>

      {/* Blog content form */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <BlogForm
          initialData={blog}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import BlogForm from "../../components/blogs/BlogForm";
import { adminGetBlogById, adminUpdateBlog } from "../../services/adminApi";
import { Loader2 } from "lucide-react";

const SLUG_REGEX = /^[a-z0-9-]+$/;

export default function EditBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [slugValue, setSlugValue] = useState("");
  const [slugError, setSlugError] = useState("");
  const [slugSaving, setSlugSaving] = useState(false);
  const [slugSaved, setSlugSaved] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await adminGetBlogById(id);
      setBlog(res.data);
      setSlugValue(res.data.slug);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    await adminUpdateBlog(id, {
      title: data.title,
      content: data.content,
    });
    navigate("/admin/blogs");
  };

  const handleSlugSave = async () => {
    if (!slugValue.trim()) {
      setSlugError("Slug cannot be empty.");
      return;
    }
    if (!SLUG_REGEX.test(slugValue)) {
      setSlugError("Slug may only contain lowercase letters, numbers, and hyphens.");
      return;
    }
    setSlugError("");

    try {
      setSlugSaving(true);
      await adminUpdateBlog(id, { slug: slugValue });
      setSlugSaved(true);
      setTimeout(() => setSlugSaved(false), 2000);
    } catch (err) {
      setSlugError(err.response?.data?.message ?? "Failed to update slug.");
    } finally {
      setSlugSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-bold text-navy mb-2">Blog not found</h2>
        <Link to="/admin/blogs" className="text-sm text-coral hover:underline">
          Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Edit blog</h1>
        <p className="text-sm text-gray-400 mt-0.5 truncate max-w-sm">{blog.title}</p>
      </div>

      <Link
        to="/admin/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        All blogs
      </Link>

      {/* Slug editor */}
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
                onChange={(e) => { setSlugValue(e.target.value); setSlugError(""); setSlugSaved(false); }}
                className={`w-full pl-14 pr-4 py-3 bg-stone-50 border rounded-xl text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 transition ${
                  slugError
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200 focus:ring-coral/30 focus:border-coral"
                }`}
              />
            </div>
            {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
          </div>
          <button
            onClick={handleSlugSave}
            disabled={slugSaving}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
              slugSaved
                ? "bg-green-100 text-green-700"
                : "bg-navy text-white hover:bg-navy/90 disabled:opacity-60"
            }`}
          >
            {slugSaving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : slugSaved ? (
              "Saved ✓"
            ) : (
              "Update slug"
            )}
          </button>
        </div>
        <p className="text-xs text-amber-500 mt-2">
          ⚠ Changing the slug will break any existing links to this article.
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
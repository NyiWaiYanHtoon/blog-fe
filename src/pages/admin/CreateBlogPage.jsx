import { useNavigate, Link } from "react-router-dom";
import BlogForm from "../../components/blogs/BlogForm";

export default function CreateBlogPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    // TODO: call blogApi.createBlog(data)
    console.log("Create blog:", data);
    navigate("/admin/blogs");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">New blog</h1>
          <p className="text-sm text-gray-400 mt-0.5">Fill in the details below to create a new article.</p>
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

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <BlogForm onSubmit={handleSubmit} submitLabel="Create blog" />
      </div>
    </div>
  );
}
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogBySlug, getBlogComments } from "../services/blogApi";
import BlogGallery from "../components/blogs/BlogGallaery";
import CommentList from "../components/blogs/CommentList";
import CommentForm from "../components/blogs/CommentForm";
import { Loader2, Eye, ChevronLeft } from "lucide-react";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // fetch blogs and comments in parallel
      const [blogRes, commentsRes] = await Promise.all([
        getBlogBySlug(slug),
        getBlogComments(slug),
      ]);
      setBlog(blogRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
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
        <p className="text-4xl mb-3">🔍</p>
        <h2 className="text-xl font-bold text-navy mb-2">Article not found</h2>
        <p className="text-gray-500 text-sm mb-6">
          The article you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-coral hover:text-coral/80"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to articles
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(blog.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        All articles
      </Link>

      {/* Cover image */}
      {blog.cover_image_url && (
        <div className="rounded-2xl overflow-hidden aspect-video bg-gray-100">
          <img
            src={blog.cover_image_url}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title & meta */}
      <div className="mt-7">
        <h1 className="text-3xl font-bold text-navy leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
          <span>{formattedDate}</span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {blog.view_count?.toLocaleString()} views
          </span>
        </div>
      </div>

      <hr className="my-7 border-gray-100" />

      {/* Content */}
      <div className="prose prose-gray prose-sm max-w-none leading-relaxed text-gray-700">
        {blog.content}
      </div>

      {/* Gallery */}
      <BlogGallery images={blog.images} />

      <hr className="my-10 border-gray-100" />

      {/* Comments section */}
      <section>
        <h3 className="text-lg font-bold text-navy mb-5">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({comments.length})
            </span>
          )}
        </h3>
        <CommentList comments={comments} />
      </section>

      <hr className="my-8 border-gray-100" />

      <CommentForm slug={slug} />
    </article>
  );
}
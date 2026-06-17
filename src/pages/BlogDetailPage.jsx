import { useParams, Link } from "react-router-dom";
import { blogs } from "../data/dummyBlogs";
import { comments as allComments } from "../data/DummyComments";
import BlogGallery from "../components/blogs/BlogGallaery"
import CommentList from "../components/blogs/CommentList";
import CommentForm from "../components/blogs/commentForm";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    return (
      <div className="text-center py-24">
        <p className="text-4xl mb-3">🔍</p>
        <h2 className="text-xl font-bold text-navy mb-2">Article not found</h2>
        <p className="text-gray-500 text-sm mb-6">The article you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-coral hover:text-coral/80"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to articles
        </Link>
      </div>
    );
  }

  const approvedComments = allComments.filter(
    (c) => c.blogId === blog.id && c.status === "approved"
  );

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-GB", {
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All articles
      </Link>

      {/* Cover image */}
      <div className="rounded-2xl overflow-hidden aspect-video bg-gray-100">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title & meta */}
      <div className="mt-7">
        <h1 className="text-3xl font-bold text-navy leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
          <span>{formattedDate}</span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {blog.viewCount.toLocaleString()} views
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-7 border-gray-100" />

      {/* Content */}
      <div className="prose prose-gray prose-sm max-w-none leading-relaxed text-gray-700">
        {blog.content}
      </div>

      {/* Gallery */}
      <BlogGallery images={blog.images} />

      {/* Divider */}
      <hr className="my-10 border-gray-100" />

      {/* Comments section */}
      <section>
        <h3 className="text-lg font-bold text-navy mb-5">
          Comments
          {approvedComments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({approvedComments.length})
            </span>
          )}
        </h3>

        <CommentList comments={approvedComments} />
      </section>

      <hr className="my-8 border-gray-100" />

      <CommentForm />
    </article>
  );
}
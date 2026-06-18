import { Link } from "react-router-dom";
import { Eye, ChevronRight } from "lucide-react";

export default function BlogCard({ blog }) {
  const formattedDate = new Date(blog.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Cover image */}
      <div className="overflow-hidden h-52">
        <img
          src={blog.cover_image_url}
          alt={blog.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="text-lg font-bold text-navy leading-snug line-clamp-2 group-hover:text-coral transition-colors">
          {blog.title}
        </h2>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
          {blog.summary}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{formattedDate}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {blog.view_count.toLocaleString()}
            </span>
          </div>

          <Link
            to={`/blog/${blog.slug}`}
            className="text-xs font-semibold text-coral hover:text-coral/80 flex items-center gap-1 transition-colors"
          >
            Read more
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
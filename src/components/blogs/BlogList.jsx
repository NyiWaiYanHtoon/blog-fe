import { SearchX } from "lucide-react";
import BlogCard from "./BlogCard";

export default function BlogList({ blogs }) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <SearchX className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
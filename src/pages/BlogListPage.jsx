import { useState } from "react";
import { blogs } from "../data/DummyBlogs";
import BlogList from "../components/blogs/BlogList";
import BlogSearch from "../components/blogs/BlogSearch";
import Pagination from "../components/common/Pagination";

const BLOGS_PER_PAGE = 10;

export default function BlogListPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE));
  const paginated = filteredBlogs.slice(
    (currentPage - 1) * BLOGS_PER_PAGE,
    currentPage * BLOGS_PER_PAGE
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Articles</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"}
          {search && ` matching "${search}"`}
        </p>
      </div>

      <BlogSearch search={search} setSearch={handleSearch} />

      <div className="mt-8">
        <BlogList blogs={paginated} />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
import { useState, useEffect } from "react";
import BlogList from "../components/blogs/BlogList";
import BlogSearch from "../components/blogs/BlogSearch";
import Pagination from "../components/common/Pagination";
import { getBlogs } from "../services/blogApi";
import { Loader2 } from "lucide-react";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, search]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await getBlogs(currentPage, search);
      setBlogs(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Articles</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {total} {total === 1 ? "article" : "articles"}
          {search && ` matching "${search}"`}
        </p>
      </div>

      <BlogSearch search={search} setSearch={handleSearch} />

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <BlogList blogs={blogs} />
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
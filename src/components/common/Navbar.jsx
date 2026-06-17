import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-navy tracking-tight">
            R<span className="text-coral">Blog</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "text-coral"
                : "text-gray-500 hover:text-navy"
            }`}
          >
            Articles
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-navy text-white bg-zinc-700 transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
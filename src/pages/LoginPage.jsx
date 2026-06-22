import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/admin");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-bold text-navy">
            Dev<span className="text-coral">Blog</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            Sign in to your admin panel
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 bg-stone-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 text-white text-sm font-semibold rounded-xl bg-zinc-900 transition-colors cursor-pointer"
            >
              Sign in
            </button>
            {/* Add this right before the closing </form> tag, after the Sign in button */}

            <div className="pt-1 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-2">
                Demo purposes, use these credentials
              </p>
              <div className="flex gap-2 text-xs">
                <div className="flex-1 bg-stone-50 border border-gray-100 rounded-lg px-3 py-2">
                  <span className="text-gray-400 block leading-none mb-1">
                    Username
                  </span>
                  <span className="font-mono text-gray-600 font-medium">
                    admin
                  </span>
                </div>
                <div className="flex-1 bg-stone-50 border border-gray-100 rounded-lg px-3 py-2">
                  <span className="text-gray-400 block leading-none mb-1">
                    Password
                  </span>
                  <span className="font-mono text-gray-600 font-medium">
                    admin1234
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back to blog
          </Link>
        </p>
      </div>
    </div>
  );
}

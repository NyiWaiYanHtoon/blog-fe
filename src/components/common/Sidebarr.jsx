import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", end: true, icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  { to: "/admin/blogs", icon: <BookOpen className="w-5 h-5" />, label: "Blogs" },
  { to: "/admin/comments", icon: <MessageSquare className="w-5 h-5" />, label: "Comments" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-60 shrink-0 h-screen bg-zinc-900 flex flex-col fixed">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="text-lg font-bold text-white">
          Dev<span className="text-coral">Blog</span>
          <span className="ml-2 text-xs font-normal text-white/40">Admin</span>
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
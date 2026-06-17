import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 py-10">
        <Outlet />
      </div>
    </div>
  );
}
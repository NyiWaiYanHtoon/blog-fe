import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, X, MessageSquare, Loader2 } from "lucide-react";
import { adminGetComments, adminApproveComment, adminRejectComment } from "../../services/adminApi";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function CommentManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("status") ?? "all";

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await adminGetComments();
      setComments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActioningId(id);
      await adminApproveComment(id);
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActioningId(id);
      await adminRejectComment(id);
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "rejected" } : c))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActioningId(null);
    }
  };

  const filtered =
    activeTab === "all"
      ? comments
      : comments.filter((c) => c.status === activeTab);

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Comments</h1>
        <p className="text-sm text-gray-400 mt-1">Review and moderate reader comments.</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() =>
              setSearchParams(tab.value === "all" ? {} : { status: tab.value })
            }
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === tab.value
                ? "bg-white text-navy shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {counts[tab.value] > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.value
                    ? tab.value === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-500"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {counts[tab.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Comments list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No comments in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((comment) => {
            const formattedDate = new Date(comment.created_at).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            });

            return (
              <div key={comment.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: meta + content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="font-semibold text-sm text-navy">{comment.author_name}</span>
                      <span className="text-xs text-gray-400">{formattedDate}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[comment.status]}`}>
                        {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">
                      {comment.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      On:{" "}
                      <span className="text-gray-500 font-medium">
                        {comment.blog?.title ?? "Unknown blog"}
                      </span>
                    </p>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {actioningId === comment.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <>
                        {comment.status !== "approved" && (
                          <button
                            onClick={() => handleApprove(comment.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                        )}
                        {comment.status !== "rejected" && (
                          <button
                            onClick={() => handleReject(comment.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
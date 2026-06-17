import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { comments as initialComments } from "../../data/DummyComments";
import { blogs } from "../../data/dummyBlogs";
import { Link } from "react-router-dom";

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

  const [comments, setComments] = useState(
    // Add a few extra dummy comments to show all statuses
    [
      ...initialComments,
      {
        id: 6, blogId: 3, authorName: "ณัฐพล เว็บดีไซน์",
        content: "บทความนี้มีประโยชน์มากเลยครับ", createdAt: "2026-06-13", status: "pending",
      },
      {
        id: 7, blogId: 1, authorName: "อรทัย โปรแกรมเมอร์",
        content: "ขอบคุณสำหรับบทความดีๆ นะคะ 123", createdAt: "2026-06-14", status: "rejected",
      },
    ]
  );

  const getBlogTitle = (blogId) =>
    blogs.find((b) => b.id === blogId)?.title ?? "Unknown blog";

  const filtered =
    activeTab === "all"
      ? comments
      : comments.filter((c) => c.status === activeTab);

  const updateStatus = (id, status) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
  };

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
          <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm">No comments in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((comment) => {
            const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            });

            return (
              <div
                key={comment.id}
                className="bg-white border border-gray-100 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: meta + content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="font-semibold text-sm text-navy">{comment.authorName}</span>
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
                        {getBlogTitle(comment.blogId)}
                      </span>
                    </p>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {comment.status !== "approved" && (
                      <button
                        onClick={() => updateStatus(comment.id, "approved")}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                    )}
                    {comment.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(comment.id, "rejected")}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
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
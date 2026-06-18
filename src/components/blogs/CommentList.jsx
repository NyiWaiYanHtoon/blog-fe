export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <svg
          className="w-8 h-8 mx-auto mb-2 opacity-40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-sm">No comments yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        // Initials avatar from author name (supports Thai — just take first char)
        const initial = comment.author_name.trim().charAt(0).toUpperCase();

        return (
          <div
            key={comment.id}
            className="flex gap-3"
          >
            {/* Avatar */}
            <div className="shrink-0 w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center text-sm font-semibold text-navy">
              {initial}
            </div>

            {/* Bubble */}
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-sm font-semibold text-navy">
                  {comment.authorName}
                </span>
                <span className="text-xs text-gray-400 shrink-0">{formattedDate}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
import { useState } from "react";

const THAI_REGEX = /^[ก-๙0-9\s]+$/;

export default function CommentForm() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!comment.trim()) {
      setError("Please enter a comment.");
      return;
    }
    if (!THAI_REGEX.test(comment.trim())) {
      setError("Comment must contain only Thai characters and/or numbers.");
      return;
    }

    setSubmitted(true);
    setName("");
    setComment("");
  };

  if (submitted) {
    return (
      <div className="mt-10 p-5 bg-green-50 border border-green-200 rounded-xl text-center">
        <svg className="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-sm font-medium text-green-700">Comment submitted!</p>
        <p className="text-xs text-green-600 mt-1">It will appear after admin approval.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-3 text-xs text-green-600 underline hover:text-green-800"
        >
          Write another comment
        </button>
      </div>
    );
  }

  return (
    <section className="mt-10">
      <h3 className="text-lg font-bold text-navy mb-5">Leave a comment</h3>

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Name <span className="text-coral">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Comment <span className="text-coral">*</span>
            <span className="ml-2 text-xs font-normal text-gray-400">(Thai characters and numbers only)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="เขียนความคิดเห็นของคุณ..."
            rows={4}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1.5">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="px-6 py-2.5 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-navy/90 transition-colors"
        >
          Submit comment
        </button>
      </form>
    </section>
  );
}
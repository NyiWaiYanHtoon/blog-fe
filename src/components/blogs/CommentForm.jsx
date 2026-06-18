import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { submitComment } from "../../services/blogApi";

const THAI_REGEX = /^[ก-๙0-9\s]+$/;

export default function CommentForm({ slug }) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!comment.trim()) { setError("Please enter a comment."); return; }
    if (!THAI_REGEX.test(comment.trim())) {
      setError("Comment must contain only Thai characters and/or numbers.");
      return;
    }

    try {
      setLoading(true);
      //submit comment to backend
      await submitComment(slug, { authorName: name, content: comment });
      setSubmitted(true);
      setName("");
      setComment("");
    } catch (err) {
      setError("Failed to submit comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-10 p-5 bg-green-50 border border-green-200 rounded-xl text-center">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
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
            <span className="ml-2 text-xs font-normal text-gray-400">
              (Thai characters and numbers only)
            </span>
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
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-navy/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              Submitting...
            </>
          ) : (
            "Submit comment"
          )}
        </button>
      </form>
    </section>
  );
}
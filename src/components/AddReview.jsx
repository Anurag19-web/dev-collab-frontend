import { useState } from "react";
import BASE_URL from "../services/api";

function AddReview({ snippetId, onReviewAdded }) {
  const [comment, setComment] = useState("");
  const userId = localStorage.getItem("mongoId");


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      console.log("Comment is empty");
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/snippets/${snippetId}/review`, // ✅ FIXED URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, comment })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Review failed:", data);
        return;
      }

      // ✅ Clear input
      setComment("");

      // ✅ Refresh parent data
      if (onReviewAdded) {
        onReviewAdded();
      }

    } catch (err) {
      console.error("Review error:", err);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="mb-3 font-semibold text-xl">
        Add Review
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="bg-white/5 p-3 border border-white/10 focus:border-blue-400 rounded-lg focus:outline-none text-sm"
        />

        <button
          type="submit"
          className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-md font-medium text-sm transition"
        >
          Submit Review
        </button>

      </form>
    </div>
  );
}

export default AddReview;
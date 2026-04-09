import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BASE_URL from "../services/api";

function SnippetReviews() {

  const { id } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/snippets/${id}`);
        const data = await res.json();

        setReviews(data.reviews || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviews();
  }, [id]);

  return (
    <div className="bg-slate-900 px-6 py-10 min-h-screen text-white">

      <h1 className="mb-6 font-bold text-2xl">
        All Reviews
      </h1>

      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet.</p>
      ) : (
        <div className="space-y-4">

          {reviews.map((review) => (
  <div
    key={review._id}
    className="bg-white/5 hover:bg-white/10 p-4 border border-white/10 rounded-lg transition"
  >

    {/* USER INFO (TOP) */}
    <div className="flex items-center gap-3 mb-3">

      {/* PROFILE IMAGE */}
      <img
        src={
          review.user?.profilePicture ||
          "https://i.pravatar.cc/100"
        }
        alt="user"
        className="border border-white/20 rounded-full w-10 h-10 object-cover"
      />

      {/* NAME */}
      <Link
        to={`/profile/${review.user?.userId}`}
        className="font-medium text-gray-300 hover:text-blue-400 transition"
      >
        {review.user?.name || "Anonymous"}
      </Link>

    </div>

    {/* REVIEW TEXT (BOTTOM) */}
    <p className="text-gray-400 text-sm leading-relaxed">
      {review.comment}
    </p>

  </div>
))}

        </div>
      )}

    </div>
  );
}

export default SnippetReviews;
import { Link } from "react-router-dom";

function ReviewList({ reviews }) {

  if (!reviews || reviews.length === 0) {
    return (
      <p className="mt-4 text-gray-400 text-sm">
        No reviews yet 🚫
      </p>
    );
  }

  return (
    <div className="space-y-4 mt-6">

      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-white/5 hover:bg-white/10 p-4 border border-white/10 rounded-lg transition"
        >

          {/* 👤 USER INFO (TOP) */}
          <div className="flex items-center gap-3 mb-3">

            <img
              src={
                review.user?.profilePicture ||
                "https://i.pravatar.cc/100"
              }
              alt="user"
              className="border border-white/20 rounded-full w-9 h-9 object-cover"
            />

            <Link
              to={`/profile/${review.user?.userId}`}
              className="font-medium text-gray-300 hover:text-blue-400 transition"
            >
              {review.user?.name || "Anonymous"}
            </Link>

          </div>

          {/* 💬 REVIEW TEXT (BOTTOM) */}
          <p className="text-gray-400 text-sm leading-relaxed">
            {review.comment}
          </p>

        </div>
      ))}

    </div>
  );
}

export default ReviewList;
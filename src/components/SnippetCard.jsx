import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "../services/api";
import { ThumbsUp, MessageSquare, Code2, ChevronRight } from "lucide-react";

function SnippetCard({ snippet, onLikeUpdate }) {
  const currentUserId = localStorage.getItem("mongoId");
  const navigate = useNavigate();

  // 1. Create a local state that "mirrors" the snippet likes
  const [localLikes, setLocalLikes] = useState(snippet.likes || []);

  // 2. Keep the local state in sync if the parent data changes
  useEffect(() => {
    setLocalLikes(snippet.likes || []);
  }, [snippet.likes]);

  const isLiked = currentUserId && localLikes.some((id) => id.toString() === currentUserId);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) return alert("Please login to like!");

    // --- OPTIMISTIC UPDATE START ---
    // We update the UI BEFORE the fetch finishes
    const alreadyLiked = localLikes.some(id => id.toString() === currentUserId);
    let updatedLikes;

    if (alreadyLiked) {
      // Remove the like locally
      updatedLikes = localLikes.filter(id => id.toString() !== currentUserId);
    } else {
      // Add the like locally
      updatedLikes = [...localLikes, currentUserId];
    }
    
    setLocalLikes(updatedLikes); // UI turns Blue/Gray INSTANTLY
    // --- OPTIMISTIC UPDATE END ---

    try {
      const res = await fetch(`${BASE_URL}/snippets/${snippet._id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId })
      });

      if (res.ok) {
        // Sync with the actual database data
        if (onLikeUpdate) onLikeUpdate();
      } else {
        // Rollback if server fails
        setLocalLikes(snippet.likes);
      }
    } catch (err) {
      console.error("Like error:", err);
      // Rollback if network fails
      setLocalLikes(snippet.likes);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/snippet/${snippet._id}`)}
      className="group relative flex flex-col bg-[#0f172a]/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.1)] backdrop-blur-xl p-5 border border-white/10 hover:border-blue-500/40 rounded-2xl transition-all hover:-translate-y-1 duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-2 bg-blue-500/10 mb-4 px-2 py-1 border border-blue-500/20 rounded-md w-fit font-mono font-bold text-[10px] text-blue-400 uppercase tracking-widest">
        <Code2 size={12} /> {snippet.language}
      </div>

      <h3 className="mb-3 font-bold text-white group-hover:text-blue-400 text-lg truncate transition-colors">
        {snippet.title}
      </h3>

      <div className="relative flex-1 bg-black/40 mb-5 p-4 border border-white/5 rounded-xl overflow-hidden">
        <div className="font-mono text-[11px] text-gray-400 italic line-clamp-3">
          {snippet.code.substring(0, 100)}...
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-white/5 border-t">
        <div className="flex gap-4">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={handleLike}
              className={`p-2 transition-all duration-200 border-r border-white/10 ${
                isLiked ? "text-blue-400 bg-blue-500/20" : "text-gray-500 hover:text-white hover:bg-white/10"
              }`}
            >
              <ThumbsUp size={15} fill={isLiked ? "currentColor" : "none"} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/snippet/${snippet._id}/likes`);
              }}
              className="px-3 py-1.5 font-bold text-gray-400 hover:text-blue-400 text-xs"
            >
              {localLikes.length}
            </button>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/snippet/${snippet._id}/reviews`); }} 
            className="flex items-center gap-1.5 text-gray-500 hover:text-blue-400 transition-colors"
          >
            <MessageSquare size={16} />
            <span className="font-bold text-xs">{snippet.reviews?.length || 0}</span>
          </button>
        </div>

        <ChevronRight size={18} className="text-blue-400 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}

export default SnippetCard;
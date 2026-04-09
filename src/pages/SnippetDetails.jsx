import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AddReview from "../components/AddReview";
import ReviewList from "../components/ReviewList";
import BASE_URL from "../services/api";
import { ThumbsUp, Send, Sparkles, Copy, MessageSquare } from "lucide-react";

function SnippetDetails() {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI States
  const [userQuery, setUserQuery] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loadingExplain, setLoadingExplain] = useState(false);

  const currentUserId = localStorage.getItem("mongoId");

  const isLiked = snippet?.likes?.some(
    (uid) => uid.toString() === currentUserId
  );

  // 🔥 SMART SUGGESTIONS
  const autoSuggestions = [
    "Find bugs in this code",
    "Optimize performance",
    "Explain step by step",
    "Security issues?",
    "Refactor this code"
  ];

  const fetchSnippet = async () => {
    try {
      const res = await fetch(`${BASE_URL}/snippets/${id}`);
      const data = await res.json();
      setSnippet(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippet();
  }, [id]);

  const handleLike = async () => {
    if (!currentUserId) return alert("Please login to like");

    try {
      const res = await fetch(`${BASE_URL}/snippets/${id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId })
      });
      if (res.ok) fetchSnippet();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // 🧠 NORMAL AI EXPLAIN
  const handleExplainCode = async () => {
    if (!snippet?.code) return;

    try {
      setLoadingExplain(true);

      const res = await fetch(`${BASE_URL}/explain-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: snippet.code,
          query: userQuery || "Explain this code in detail."
        }),
      });

      const data = await res.json();
      setExplanation(data.explanation);
      setUserQuery("");
    } catch (err) {
      setExplanation("AI is currently unavailable.");
    } finally {
      setLoadingExplain(false);
    }
  };

  // 🚀 NEW FEATURE: FULL A → Z EXPLANATION
  const handleFullExplain = async () => {
    if (!snippet?.code) return;

    try {
      setLoadingExplain(true);

      const res = await fetch(`${BASE_URL}/explain-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: snippet.code,
          query: `
            Explain this code from A to Z in full detail.
            Include:
            - Overall purpose
            - Step-by-step breakdown
            - Functions explanation
            - Logic flow
            - Edge cases
          `
        }),
      });

      const data = await res.json();
      setExplanation(data.explanation);
      setUserQuery("");
    } catch (err) {
      setExplanation("Failed to generate full explanation.");
    } finally {
      setLoadingExplain(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(snippet.code);
    alert("Code copied to clipboard!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center bg-[#0b0f1a] min-h-screen text-white">
        Loading...
      </div>
    );

  if (!snippet)
    return (
      <div className="flex justify-center items-center bg-[#0b0f1a] min-h-screen text-white">
        Snippet not found
      </div>
    );

  return (
    <div className="bg-[#0b0f1a] pb-20 min-h-screen text-white">

      {/* BACK */}
      <div className="mx-auto px-6 pt-10 max-w-7xl">
        <Link to="/home" className="text-gray-500 hover:text-white text-sm transition">
          ← Back to Explorer
        </Link>
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3 mx-auto px-6 py-8 max-w-7xl">

        {/* LEFT SIDE */}
        <div className="space-y-8 lg:col-span-2">

          {/* CODE CARD */}
          <div className="bg-white/5 backdrop-blur-md p-8 border border-white/10 rounded-2xl">

            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-2 font-extrabold text-transparent text-4xl">
                  {snippet.title}
                </h1>
                <span className="bg-blue-500/10 px-3 py-1 border border-blue-500/20 rounded-full font-mono text-blue-400 text-xs uppercase">
                  {snippet.language}
                </span>
              </div>

              <button
                onClick={copyCode}
                className="bg-white/5 hover:bg-white/10 p-2 border border-white/10 rounded-lg"
              >
                <Copy size={18} />
              </button>
            </div>

            <pre className="bg-black/40 p-6 border border-white/5 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed">
              <code>{snippet.code}</code>
            </pre>

            {/* LIKE + REVIEWS */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-white/5 border-t">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl ${
                  isLiked
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                }`}
              >
                <ThumbsUp size={18} />
                {snippet.likes?.length || 0}
              </button>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MessageSquare size={18} />
                {snippet.reviews?.length || 0} Reviews
              </div>
            </div>

            {/* 🚀 NEW BUTTON */}
            <button
              onClick={handleFullExplain}
              disabled={loadingExplain}
              className="bg-gradient-to-r from-purple-600 hover:from-purple-500 to-blue-600 hover:to-blue-500 shadow-lg mt-6 p-3 rounded-xl w-full font-bold transition"
            >
              🤖 Explain Complete Code
            </button>

          </div>

          {/* REVIEWS */}
          <div className="bg-white/5 backdrop-blur-md p-8 border border-white/10 rounded-2xl">
            <h2 className="mb-6 font-bold text-xl">Community Discussion</h2>
            <AddReview snippetId={snippet._id} onReviewAdded={fetchSnippet} />
            <div className="mt-8">
              <ReviewList reviews={snippet.reviews || []} />
            </div>
          </div>

        </div>

        {/* RIGHT AI PANEL */}
        <div className="lg:col-span-1">
          <div className="top-10 sticky flex flex-col bg-[#161b2b] border border-purple-500/20 rounded-2xl h-[650px] overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-center bg-white/5 p-5 border-white/10 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 rounded-full w-2 h-2 animate-pulse" />
                <span className="font-bold text-purple-400 text-xs uppercase">
                  AI Debugger
                </span>
              </div>
              <Sparkles size={16} />
            </div>

            {/* CHAT */}
            <div className="flex-1 space-y-4 p-5 overflow-y-auto">

              {!explanation && !loadingExplain && (
                <div className="text-center">
                  <Sparkles size={32} className="mx-auto mb-4 text-purple-400" />
                  <p className="text-gray-500 text-xs">
                    AI analyzes your code automatically
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {autoSuggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setUserQuery(s);
                          handleExplainCode();
                        }}
                        className="bg-white/5 px-3 py-1.5 border border-white/10 rounded-lg text-[10px]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {explanation && (
                <div className="bg-purple-500/10 p-5 border border-purple-500/20 rounded-2xl text-sm leading-relaxed">
                  {explanation}
                </div>
              )}

              {loadingExplain && (
                <p className="text-purple-400 text-sm animate-pulse">
                  Analyzing code...
                </p>
              )}

            </div>

            {/* INPUT */}
            <div className="bg-black/20 p-5 border-white/10 border-t">
              <div className="relative">
                <textarea
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Ask AI..."
                  rows="2"
                  className="bg-white/5 p-4 pr-14 border border-white/10 rounded-xl w-full text-sm resize-none"
                />

                <button
                  onClick={handleExplainCode}
                  className="right-3 bottom-3 absolute bg-purple-600 p-2 rounded-xl"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default SnippetDetails;
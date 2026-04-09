import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../services/api";

function CreateSnippet() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // 🤖 AI CODE GENERATION
  const handleGenerateCode = async () => {

    if (!title || !language) {
      alert("Please enter title and language first");
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch(`${BASE_URL}/generate-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          language
        })
      });

      const data = await res.json();

      if (res.ok) {
        setCode(data.code); // 🔥 auto fill textarea
      } else {
        alert(data.message || "Failed to generate code");
      }

    } catch (err) {
      console.error(err);
      alert("AI generation failed");
    }

    setGenerating(false);
  };


  // 🧠 CREATE SNIPPET
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const userId = localStorage.getItem("userId");

    try {

      const res = await fetch(`${BASE_URL}/snippets/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          language,
          code,
          user: userId
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Snippet Created Successfully 🚀");
        navigate("/home");
      } else {
        alert(data.message || "Error creating snippet");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };


return (
  <div className="bg-[#0b0f1a] pb-20 min-h-screen text-white">

    {/* TOP GRADIENT BANNER (like Profile page) */}
    <div className="bg-gradient-to-b from-purple-900/20 to-[#0b0f1a] h-44" />

    <div className="mx-auto -mt-20 px-6 max-w-5xl">

      {/* MAIN CARD */}
      <div className="bg-white/5 shadow-2xl backdrop-blur-3xl p-8 border border-white/10 rounded-3xl">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <h2 className="font-black text-4xl uppercase tracking-tight">
            Create Snippet
          </h2>
          <p className="mt-2 text-gray-400 text-sm">
            Build, generate and save your code snippets
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* TITLE */}
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-widest">
              Title
            </label>
            <input
              className="bg-white/5 mt-2 p-4 border border-white/10 focus:border-blue-500 rounded-xl focus:outline-none w-full text-white transition"
              placeholder="e.g. JWT Authentication API"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* LANGUAGE */}
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-widest">
              Language
            </label>
            <input
              className="bg-white/5 mt-2 p-4 border border-white/10 focus:border-blue-500 rounded-xl focus:outline-none w-full text-white transition"
              placeholder="e.g. Node.js / Python / React"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>

          {/* AI BUTTON (PROFILE STYLE) */}
          <button
            type="button"
            onClick={handleGenerateCode}
            disabled={generating}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition shadow-lg ${
              generating
                ? "bg-white/10 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.01] hover:shadow-purple-500/20"
            }`}
          >
            {generating ? (
              <>
                <span className="animate-spin">⚙️</span>
                Generating AI Code...
              </>
            ) : (
              <>🤖 Generate with AI</>
            )}
          </button>

          {/* CODE EDITOR */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-500 text-xs uppercase tracking-widest">
                Code
              </label>
              <span className="text-[10px] text-gray-600">
                AI powered editor
              </span>
            </div>

            <textarea
              className="bg-black/40 p-5 border border-white/10 focus:border-purple-500 rounded-2xl focus:outline-none w-full h-72 font-mono text-gray-200 text-sm leading-relaxed transition resize-none"
              placeholder="Your generated code will appear here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold transition shadow-xl ${
              loading
                ? "bg-white/10 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/30"
            }`}
          >
            {loading ? "Creating Snippet..." : "✨ Publish Snippet"}
          </button>

        </form>
      </div>
    </div>
  </div>
);
}

export default CreateSnippet;
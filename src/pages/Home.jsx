import {  useEffect, useState } from "react";
import SnippetCard from "../components/SnippetCard"; // ✅ make sure path is correct
import { getSnippets } from "../services/api";

function Home() {

  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadSnippets = async () => {
      try {
        const data = await getSnippets();

        console.log("SNIPPETS DATA:", data);

        // ✅ Handle all possible API structures
        if (Array.isArray(data)) {
          setSnippets(data);
        } else if (Array.isArray(data.snippets)) {
          setSnippets(data.snippets);
        } else {
          setSnippets([]);
        }

      } catch (error) {
        console.error("Error fetching snippets:", error);
        setSnippets([]);
      } finally {
        setLoading(false);
      }
    };

    loadSnippets();

  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <p>Loading snippets...</p>
      </div>
    );
  }

  return (

    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black min-h-screen text-white">

      {/* Hero Section */}
      <div className="mx-auto px-6 pt-16 pb-10 max-w-7xl text-center">

        <h2 className="mb-4 font-bold text-4xl md:text-5xl">
          Share & Discover
          <span className="text-blue-400"> Code Snippets</span>
        </h2>

        <p className="mx-auto max-w-xl text-gray-400">
          A collaborative platform where developers can share useful code,
          learn from others, and build together.
        </p>

      </div>

      {/* Snippets Section */}
      <div className="mx-auto px-6 pb-20 max-w-7xl">

        <h3 className="mb-8 font-semibold text-2xl">
          Latest Snippets
        </h3>

        {snippets.length === 0 ? (
          <p className="text-gray-400">No snippets found</p>
        ) : (
          <div className="gap-8 grid md:grid-cols-3">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))}
          </div>
        )}

      </div>

    </div>

  );

}

export default Home;
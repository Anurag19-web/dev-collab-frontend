import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "../services/api";

function Navbar() {

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  // 🔥 Debounced API search
  useEffect(() => {

    const timer = setTimeout(async () => {

      if (!search.trim()) {
        setResults([]);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/users/search?q=${search}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      }

    }, 400); // debounce delay

    return () => clearTimeout(timer);

  }, [search]);

  return (
    <nav className="relative flex justify-between items-center bg-slate-900 px-10 py-4 text-white">

      <h1 className="font-bold text-blue-400 text-xl">
        DevCollab
      </h1>

      {/* 🔍 SEARCH */}
      <div className="relative w-1/3">

        <input
          type="text"
          placeholder="Search developers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 px-4 py-2 border border-white/10 rounded-lg w-full"
        />

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="top-12 z-50 absolute bg-slate-800 border border-white/10 rounded-lg w-full max-h-60 overflow-y-auto">
            {results.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  navigate(`/profile/${user.userId}`);
                  setSearch("");
                  setResults([]);
                }}
                className="flex items-center gap-3 hover:bg-slate-700 px-4 py-2 cursor-pointer"
              >
                {/* Profile Image */}
                <img
                  src={user.profilePicture || "/default-avatar.png"}
                  alt="profile"
                  className="rounded-full w-8 h-8 object-cover"
                />

                {/* Name (single line) */}
                <span className="font-medium">{user.name}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* NAV LINKS */}
      <div className="flex gap-6">
        <Link to="/home">Home</Link>
        <Link to="/create">Create</Link>

        {userId && (
          <Link to={`/profile/${userId}`}>
            Profile
          </Link>
        )}
      </div>

    </nav>
  );
}

export default Navbar;
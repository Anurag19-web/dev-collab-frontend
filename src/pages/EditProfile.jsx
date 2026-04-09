import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../services/api";

function EditProfile() {

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: "",
    skills: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${BASE_URL}/users/${userId}`);
      const data = await res.json();

      setFormData({
        name: data.name || "",
        role: data.role || "",
        bio: data.bio || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        portfolio: data.portfolio || "",
        skills: data.skills?.join(", ") || ""
      });
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/users/update-profile/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim())
      })
    });

    if (res.ok) {
      navigate(`/profile/${userId}`);
    } else {
      const error = await res.json();
      console.error(error.message || "Update failed");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black min-h-screen text-white">

      <div className="mx-auto px-6 py-16 max-w-3xl">

        <div className="bg-white/5 backdrop-blur-lg p-8 border border-white/10 rounded-xl">

          <h2 className="mb-6 font-bold text-2xl">
            Edit Developer Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ===== BASIC INFO ===== */}
            <div>
              <h3 className="mb-2 font-semibold text-blue-400 text-lg">
                Basic Information
              </h3>

              <label className="text-gray-300 text-sm">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="bg-slate-800 mt-1 px-4 py-3 border border-white/10 rounded-lg w-full"
              />

              <label className="block mt-3 text-gray-300 text-sm">
                Role
              </label>
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Frontend Developer / Backend Developer"
                className="bg-slate-800 mt-1 px-4 py-3 border border-white/10 rounded-lg w-full"
              />
            </div>

            {/* ===== ABOUT ===== */}
            <div>
              <h3 className="mb-2 font-semibold text-blue-400 text-lg">
                About You
              </h3>

              <label className="text-gray-300 text-sm">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell something about yourself..."
                className="bg-slate-800 mt-1 px-4 py-3 border border-white/10 rounded-lg w-full"
              />
            </div>

            {/* ===== SOCIAL LINKS ===== */}
            <div>
              <h3 className="mb-2 font-semibold text-blue-400 text-lg">
                Social Links
              </h3>

              <label className="text-gray-300 text-sm">GitHub</label>
              <input
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
                className="bg-slate-800 mt-1 px-4 py-3 border border-white/10 rounded-lg w-full"
              />

              <label className="block mt-3 text-gray-300 text-sm">
                LinkedIn
              </label>
              <input
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className="bg-slate-800 mt-1 px-4 py-3 border border-white/10 rounded-lg w-full"
              />

              <label className="block mt-3 text-gray-300 text-sm">
                Portfolio
              </label>
              <input
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
                className="bg-slate-800 mt-1 px-4 py-3 border border-white/10 rounded-lg w-full"
              />
            </div>

            {/* ===== SKILLS ===== */}
            <div>
              <h3 className="mb-2 font-semibold text-blue-400 text-lg">
                Skills
              </h3>

              <label className="text-gray-300 text-sm">
                Your Skills
              </label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="bg-slate-800 mt-1 px-4 py-3 border border-white/10 rounded-lg w-full"
              />

              <p className="mt-1 text-gray-400 text-xs">
                Separate skills using commas
              </p>
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 py-3 rounded-lg w-full font-semibold transition"
            >
              Save Profile
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditProfile;
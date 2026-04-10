import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../services/api";
import SnippetCard from "../components/SnippetCard";
import Settings from 'lucide-react/dist/esm/icons/settings';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import Code from 'lucide-react/dist/esm/icons/code';
import Camera from 'lucide-react/dist/esm/icons/camera';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import Grid3X3 from 'lucide-react/dist/esm/icons/grid-3x3';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import UserCheck from 'lucide-react/dist/esm/icons/user-check';
import Users from 'lucide-react/dist/esm/icons/users';

function Profile() {
  const { id } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const mongoId = localStorage.getItem("mongoId");
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [snippets, setSnippets] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`);
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      setProfileUser(data);

      if (data.followers && mongoId) {
        setIsFollowing(data.followers.includes(mongoId));
      }
    } catch (err) {
      setError(err.message);
    }
  }, [id, mongoId]);

  const fetchSnippets = useCallback(async () => {
    if (!profileUser?._id) return;
    try {
      const res = await fetch(`${BASE_URL}/snippets/user/${profileUser._id}`);
      const data = await res.json();
      setSnippets(Array.isArray(data) ? data : []);
    } catch (err) {
      setSnippets([]);
    }
  }, [profileUser]);

  useEffect(() => { fetchUser(); }, [fetchUser]);
  useEffect(() => { fetchSnippets(); }, [fetchSnippets]);

const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("profilePicture", file);

  try {
    const res = await fetch(
      `${BASE_URL}/users/update-profile/${profileUser.userId}`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload failed");

    fetchUser(); // refresh UI
  } catch (err) {
    console.log(err);
  }
};

  const handleFollow = async () => {
    const prev = isFollowing;
    setIsFollowing(!prev);

    try {
      const res = await fetch(`${BASE_URL}/users/follow/${profileUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: mongoId })
      });
      if (!res.ok) throw new Error();
      fetchUser();
    } catch (err) {
      setIsFollowing(prev);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (error) return <div className="p-10 font-mono text-red-400 text-center">Error: {error}</div>;
  if (!profileUser) return <div className="p-10 font-mono text-blue-400 text-center">Loading Profile...</div>;

  const isOwnProfile = currentUserId === profileUser.userId;

  return (
    <div className="bg-[#0b0f1a] pb-20 min-h-screen text-white">
      <div className="bg-gradient-to-b from-blue-900/20 to-[#0b0f1a] h-44" />

      <div className="mx-auto px-6 max-w-6xl">
        <div className="relative bg-white/5 shadow-2xl backdrop-blur-3xl -mt-20 p-8 border border-white/10 rounded-3xl">

          <div className="flex md:flex-row flex-col items-center md:items-start gap-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={profileUser.profilePicture || "https://i.pravatar.cc/150"}
                className="shadow-2xl border-[#0b0f1a] border-4 rounded-2xl w-36 h-36 object-cover"
                alt="Profile"
              />
              {isOwnProfile && (
                <label className="right-2 bottom-2 absolute bg-blue-600 hover:bg-blue-500 shadow-lg p-2 rounded-lg transition cursor-pointer">
                  <Camera size={16} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}

              {uploading && (
                <p className="mt-2 text-blue-400 text-xs">
                  Uploading...
                </p>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1 pt-2 md:text-left text-center">
              <h2 className="mb-2 font-black text-4xl uppercase tracking-tight">{profileUser.name}</h2>
              <p className="mb-6 max-w-md font-medium text-gray-400 text-sm leading-relaxed">
                {profileUser.bio || "Crafting code and sharing knowledge with the community."}
              </p>

              {/* STATS COUNTERS */}
              <div className="flex justify-center md:justify-start gap-10 mb-8 pb-6 border-white/5 border-b">
                <div className="group cursor-default">
                  <span className="block font-black text-white text-2xl">{snippets.length}</span>
                  <span className="font-bold text-[10px] text-gray-500 uppercase tracking-widest">Snippets</span>
                </div>
                <div
                  onClick={() => navigate(`/followers/${profileUser._id}`)}
                  className="group cursor-pointer"
                >
                  <span className="block font-black text-white group-hover:text-blue-400 text-2xl transition">
                    {profileUser.followers?.length || 0}
                  </span>
                  <span className="flex justify-center md:justify-start items-center gap-1 font-bold text-[10px] text-gray-500 group-hover:text-blue-400 uppercase tracking-widest transition">
                    Followers <Users size={10} />
                  </span>
                </div>
              </div>

              {/* SOCIAL LINKS (G, L, Portfolio) */}
              <div className="flex justify-center md:justify-start gap-8 mb-6 font-black text-sm">
                <a href={profileUser.github || "#"} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white tracking-widest transition">GITHUB</a>
                <a href={profileUser.linkedin || "#"} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-400 tracking-widest transition">LINKEDIN</a>
                <a href={profileUser.portfolio || "#"} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-green-400 transition">
                  <Globe size={18} />
                </a>
              </div>

              {/* SKILLS - ONLY SHOWS IF ARRAY HAS ITEMS */}
              {profileUser.skills && profileUser.skills.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {profileUser.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 border border-white/5 rounded-lg font-mono text-[11px] text-gray-300">
                      <Cpu size={12} className="text-blue-500" /> {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons Logic */}
            <div className="flex flex-col gap-3 min-w-[180px]">
              {isOwnProfile ? (
                <>
                  <Link to={`/editprofile/${profileUser.userId}`} className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 shadow-lg px-4 py-3 rounded-xl font-bold text-sm transition">
                    <Settings size={18} /> Edit Profile
                  </Link>
                  <button onClick={handleLogout} className="flex justify-center items-center gap-2 bg-white/5 hover:bg-red-500/10 px-4 py-3 border border-white/10 rounded-xl font-bold text-gray-400 hover:text-red-400 text-sm transition">
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition shadow-xl ${isFollowing
                    ? "bg-white/10 text-white border border-white/20"
                    : "bg-blue-600 hover:bg-blue-500 shadow-blue-900/40"
                    }`}
                >
                  {isFollowing ? (
                    <><UserCheck size={20} /> Following</>
                  ) : (
                    <><UserPlus size={20} /> Follow</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contributions Header (Now same for everyone) */}
        <div className="flex items-center gap-3 mt-14 mb-8 pb-5 border-white/5 border-b">
          <Grid3X3 size={22} className="text-blue-400" />
          <h3 className="font-black text-xl uppercase tracking-tight">
            My Contributions
          </h3>
        </div>

        {/* Snippets Grid */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {snippets.length > 0 ? (
            snippets.map(s => <SnippetCard key={s._id} snippet={s} onLikeUpdate={fetchSnippets} />)
          ) : (
            <div className="col-span-full bg-white/[0.01] py-28 border-2 border-white/5 border-dashed rounded-[40px] text-center">
              <Code size={48} className="mx-auto mb-4 text-gray-800" />
              <p className="font-bold text-gray-600 text-sm uppercase tracking-widest">No snippets shared yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
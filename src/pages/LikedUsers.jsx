import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BASE_URL from "../services/api";

function LikedUsers() {
  const { id } = useParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch liked users
  useEffect(() => {
    const fetchLikedUsers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/snippets/${id}/likes`);
        const data = await res.json();

        if (!res.ok) {
          console.error("Error:", data);
          return;
        }

        setUsers(data.users); // expecting array of users
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedUsers();
  }, [id]);

  if (loading) {
    return (
      <p className="mt-20 text-white text-center">
        Loading...
      </p>
    );
  }

  if (!users || users.length === 0) {
    return (
      <p className="mt-20 text-gray-400 text-center">
        No likes yet.
      </p>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black min-h-screen text-white">

      <div className="mx-auto px-6 py-16 max-w-3xl">

        <h2 className="mb-6 font-bold text-2xl">
          Liked Users
        </h2>

        <div className="space-y-4">

          {users.map((user) => (

            <div
              key={user._id}
              className="flex items-center gap-4 bg-white/5 p-4 border border-white/10 rounded-lg"
            >

              {/* Profile Image */}
              <img
                src={user.profilePicture}
                alt=""
                className="rounded-full w-10 h-10 object-cover"
              />

              {/* User Info */}
              <div>
                <p className="font-medium">
                  {user.name}
                </p>
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default LikedUsers;
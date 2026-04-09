const BASE_URL = "https://dev-collab-backend-ija5.onrender.com/api";
export default BASE_URL;

// GET ALL SNIPPETS
export const getSnippets = async () => {

  const res = await fetch(`${BASE_URL}/snippets`);

  if (!res.ok) {
    throw new Error("Failed to fetch snippets");
  }

  return res.json();
};


// CREATE SNIPPET
export const createSnippet = async (data) => {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/snippets/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Failed to create snippet");
  }

  return res.json();
};


// LIKE / UNLIKE SNIPPET
export const likeSnippet = async (id) => {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/snippets/${id}/like`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to like snippet");
  }

  return res.json();
};


// ADD REVIEW
export const addReview = async (id, comment) => {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/snippets/${id}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ comment })
  });

  if (!res.ok) {
    throw new Error("Failed to add review");
  }

  return res.json();
};
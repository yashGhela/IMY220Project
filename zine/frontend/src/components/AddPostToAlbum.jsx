import { useState, useEffect } from "react";
import { getCookie } from "../utils/cookies";
import { API } from "../config";

export function AddPostsToAlbum({ album, onDone }) {
  const userId = getCookie("userId");

  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState([]); // array of post ids
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch(`${API}/api/posts/u/${userId}`);

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setError(data.error || "Error getting posts");
          return;
        }

        setPosts(await response.json());
      } catch {
        setError("Could not connect to the server");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [userId]);

  function toggle(postId) {
    setSelected((current) =>
      current.includes(postId)
        ? current.filter((id) => id !== postId)
        : [...current, postId]
    );
  }

  async function handleSave() {
    if (selected.length === 0) return setError("Select at least one post");

    setSaving(true);
    setError("");

    try {
      // one PATCH per selected post
      const results = await Promise.all(
        selected.map((postId) => {
          const formData = new FormData();
          formData.append("album_id", album._id);

          return fetch(`${API}/api/posts/${postId}`, {
            method: "PATCH",
            body: formData,
          });
        })
      );

      const failed = results.filter((res) => !res.ok).length;

      if (failed > 0) {
        setError(`${failed} post(s) could not be added. Try again.`);
        return;
      }

      if (onDone) onDone(selected);
    } catch {
      setError("Could not connect to the server");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="m-20">
      <p className="text-lg">Add posts to "{album.album_name}"</p>

      {error && <p>{error}</p>}
      {!error && posts.length === 0 && <p>You have no posts yet</p>}

      <div className="grid grid-cols-3 gap-4 w-full my-5">
        {posts.map((post) => {
          const isSelected = selected.includes(post._id);

          return (
            <div
              key={post._id}
              onClick={() => toggle(post._id)}
              className={`relative cursor-pointer border-4 ${
                isSelected ? "border-blue-600" : "border-transparent"
              }`}
            >
              <img
                src={API + post.img_link}
                alt={post.caption}
                className="w-full aspect-square object-cover"
              />

              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="absolute top-2 left-2 h-5 w-5"
              />

              <p>{post.caption}</p>
              {post.album_id && !isSelected && <p>Already in an album</p>}
            </div>
          );
        })}
      </div>

      <button
        className="bg-black text-white hover:bg-blue-700 p-3 mr-3"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : `Add ${selected.length} post${selected.length === 1 ? "" : "s"}`}
      </button>

      <button className="p-3" onClick={() => onDone && onDone([])}>
        Skip
      </button>
    </div>
  );
}
import { useState, useEffect } from "react";
import { getCookie } from "../utils/cookies";
import { API } from "../config";

export function EditAlbum({ album, onUpdated, onDeleted }) {
  const userId = getCookie("userId");

  const [name, setName] = useState(album.album_name);
  const [description, setDescription] = useState(album.description);
  const [posts, setPosts] = useState([]); // all of this user's posts
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch(`${API}/api/posts/u/${userId}`);
        if (response.ok) setPosts(await response.json());
      } catch {
        setErrors({ form: "Could not load your posts" });
      }
    }

    loadPosts();
  }, [album._id, userId]);

  // only the owner can edit or delete
  if (userId !== album.user_id) return null;

  function validateName(value) {
    if (!value.trim()) return "Album name is required";
    if (value.trim().length > 50) return "Album name must be 50 characters or fewer";
    return "";
  }

  function validateDescription(value) {
    if (!value.trim()) return "Description is required";
    if (value.trim().length > 200) return "Description must be 200 characters or fewer";
    return "";
  }

  async function handleSave(event) {
    event.preventDefault();

    const nameError = validateName(name);
    const descriptionError = validateDescription(description);
    setErrors({ name: nameError, description: descriptionError });
    if (nameError || descriptionError) return;

    try {
      const response = await fetch(`${API}/api/albums/${album._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ album_name: name, description }),
      });

      const data = await response.json();

      if (response.ok) {
        setErrors({ form: "Album updated!" });
        if (onUpdated) {
          onUpdated({ ...album, album_name: name.trim(), description: description.trim() });
        }
      } else {
        setErrors({ form: data.error });
      }
    } catch {
      setErrors({ form: "Could not connect to the server" });
    }
  }

  // albumId = this album's id to add, or null to remove
  async function setPostAlbum(postId, albumId) {
    try {
      const response = await fetch(`${API}/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ album_id: albumId }),
      });

      if (response.ok) {
        setPosts(posts.map((p) => (p._id === postId ? { ...p, album_id: albumId } : p)));
      } else {
        const data = await response.json();
        setErrors({ form: data.error });
      }
    } catch {
      setErrors({ form: "Could not connect to the server" });
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this album? Your posts will be kept.")) return;

    try {
      const response = await fetch(`${API}/api/albums/${album._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (onDeleted) onDeleted(album._id);
      } else {
        const data = await response.json();
        setErrors({ form: data.error });
      }
    } catch {
      setErrors({ form: "Could not connect to the server" });
    }
  }

  const inAlbum = posts.filter((p) => p.album_id === album._id);
  const available = posts.filter((p) => p.album_id !== album._id);

  return (
    <div>
      <form onSubmit={handleSave}>
        <p>Change album name</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p>{errors.name}</p>}

        <p>Change description</p>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p>{errors.description}</p>}

        {errors.form && <p>{errors.form}</p>}

        <button type="submit">Save</button>
        <button type="button" onClick={handleDelete}>Delete album</button>
      </form>

      <p>Posts in this album ({inAlbum.length})</p>
      {inAlbum.length === 0 && <p>No posts in this album yet</p>}
      <div className="grid grid-cols-3 gap-2">
        {inAlbum.map((post) => (
          <div key={post._id}>
            <img src={API + post.img_link} alt={post.caption} />
            <button type="button" onClick={() => setPostAlbum(post._id, null)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <p>Add posts</p>
      {available.length === 0 && <p>No other posts to add</p>}
      <div className="grid grid-cols-3 gap-2">
        {available.map((post) => (
          <div key={post._id}>
            <img src={API + post.img_link} alt={post.caption} />
            {post.album_id && <p>(in another album)</p>}
            <button type="button" onClick={() => setPostAlbum(post._id, album._id)}>
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
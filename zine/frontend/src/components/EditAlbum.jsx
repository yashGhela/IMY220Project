import { useState, useEffect } from "react";
import { API } from "../config";

export function EditAlbum({ album, albumPosts, onSaved }) {
  const userId = album.user_id;

  const [name, setName] = useState(album.album_name || "");
  const [description, setDescription] = useState(album.description || "");

  const [otherPosts, setOtherPosts] = useState([]); // user's posts not in this album
  const [toRemove, setToRemove] = useState([]); // post ids
  const [toAdd, setToAdd] = useState([]); // post ids

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOtherPosts() {
      try {
        const response = await fetch(`${API}/api/posts/u/${userId}`);
        if (!response.ok) return;

        const list = await response.json();
        setOtherPosts(list.filter((p) => p.album_id !== album._id));
      } catch {
        setError("Could not load your other posts");
      }
    }

    loadOtherPosts();
  }, [userId, album._id]);

  function toggle(list, setList, postId) {
    setList(
      list.includes(postId)
        ? list.filter((id) => id !== postId)
        : [...list, postId]
    );
  }

  // an empty album_id clears the album on the backend (it stores null)
  function setPostAlbum(postId, albumId) {
    const formData = new FormData();
    formData.append("album_id", albumId);

    return fetch(`${API}/api/posts/${postId}`, {
      method: "PATCH",
      body: formData,
    });
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!name.trim()) return setError("Album name is required");
    if (name.trim().length > 50) return setError("Album name must be 50 characters or fewer");
    if (!description.trim()) return setError("Description is required");
    if (description.trim().length > 200) return setError("Description must be 200 characters or fewer");

    setSaving(true);
    setError("");

    try {
      const albumRes = await fetch(`${API}/api/albums/${album._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          album_name: name.trim(),
          description: description.trim(),
        }),
      });

      if (!albumRes.ok) {
        const data = await albumRes.json().catch(() => ({}));
        return setError(data.error || "Failed to update album");
      }

      const results = await Promise.all([
        ...toRemove.map((postId) => setPostAlbum(postId, "")),
        ...toAdd.map((postId) => setPostAlbum(postId, album._id)),
      ]);

      const failed = results.filter((res) => !res.ok).length;
      if (failed > 0) {
        return setError(`Album saved, but ${failed} post change(s) failed. Try again.`);
      }

      onSaved();
    } catch {
      setError("Could not connect to the server");
    } finally {
      setSaving(false);
    }
  }

  function renderPost(post, selectedList, setList, selectedBorder, label) {
    const isSelected = selectedList.includes(post._id);

    return (
      <div
        key={post._id}
        onClick={() => toggle(selectedList, setList, post._id)}
        className={`relative cursor-pointer border-4 ${
          isSelected ? selectedBorder : "border-transparent"
        }`}
      >
        <img
          src={API + post.img_link}
          alt={post.caption}
          className="w-full aspect-square object-cover"
        />
        <p>{post.caption}</p>
        {isSelected && <p className="font-bold">{label}</p>}
      </div>
    );
  }

  return (
    <form className="border border-gray-600 p-10 my-5" onSubmit={handleSave}>
      <p>Album name</p>
      <input
        type="text"
        className="w-80 text-lg border border-gray-400 bg-gray-300 p-2 my-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <p>Description</p>
      <textarea
        className="w-80 resize-y text-lg border border-gray-400 bg-gray-300 p-2 my-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <p className="mt-5 font-bold">Posts in this album (click to remove)</p>
      <div className="grid grid-cols-3 gap-4 w-full my-3">
        {albumPosts.length === 0 && <p className="col-span-3">No posts in this album</p>}
        {albumPosts.map((post) =>
          renderPost(post, toRemove, setToRemove, "border-red-600", "Will be removed")
        )}
      </div>

      <p className="mt-5 font-bold">Add posts (click to add)</p>
      <div className="grid grid-cols-3 gap-4 w-full my-3">
        {otherPosts.length === 0 && <p className="col-span-3">No other posts to add</p>}
        {otherPosts.map((post) =>
          renderPost(post, toAdd, setToAdd, "border-blue-600", "Will be added")
        )}
      </div>

      {error && <p>{error}</p>}

      <button
        className="bg-black text-white hover:bg-blue-700 p-3"
        type="submit"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
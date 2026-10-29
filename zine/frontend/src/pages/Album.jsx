import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { PostPreview } from "../components/PostPreview";
import { EditAlbum } from "../components/EditAlbum";
import { getCookie } from "../utils/cookies";
import { API } from "../config";

export function Album() {
  const { id } = useParams();
  const userId = getCookie("userId");

  const [album, setAlbum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [albumRes, postsRes] = await Promise.all([
        fetch(`${API}/api/albums/${id}`),
        fetch(`${API}/api/posts`),
      ]);

      if (!albumRes.ok) {
        const data = await albumRes.json().catch(() => ({}));
        setError(data.error || "Error getting album");
        return;
      }

      setError("");
      setAlbum(await albumRes.json());

      if (postsRes.ok) {
        const allPosts = await postsRes.json();
        setPosts(allPosts.filter((p) => p.album_id === id));
      }
    } catch {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    setEditing(false);
    load();
  }, [id]);

  const isOwner = album && userId === album.user_id;

  return (
    <div className="bg-gray-300 min-h-screen h-full">
      <Navigation />

      {loading && <p className="m-5">Loading...</p>}
      {error && <p className="m-5">{error}</p>}

      {album && (
        <div className="m-5 flex flex-col " >
          <div className="text-left mt-10 ml-10">
            <p className="text-5xl mt-5 font-heading font-bold">{album.album_name}</p>
          <p>{album.description}</p>
          </div>

          {isOwner && (
            <button className="my-3  bg-black hover:bg-blue-700 text-white w-fit ml-10 p-2" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit album"}
            </button>
          )}

          <hr />

          {editing ? (
            <EditAlbum
              album={album}
              albumPosts={posts}
              onSaved={() => {
                setEditing(false);
                load();
              }}
            />
          ) : (
            <div className="grid grid-cols-3 gap-4 w-full my-5">
              {posts.length === 0 && (
                <p className="col-span-3">No posts in this album yet</p>
              )}

              {posts.map((post) => (
                <PostPreview post={post} key={post._id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
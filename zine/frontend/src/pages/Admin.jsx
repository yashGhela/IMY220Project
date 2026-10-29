import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { EditProfile } from "../components/EditProfile";
import { EditPost } from "../components/EditPost";
import { EditAlbum } from "../components/EditAlbum";
import { getCookie } from "../utils/cookies";
import { API } from "../config";

const ENDPOINTS = {
  user: "users",
  post: "posts",
  album: "albums",
  report: "reports",
};

export function Admin() {
  const viewerId = getCookie("userId");

  const [viewer, setViewer] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [reports, setReports] = useState([]);

  const [tab, setTab] = useState("users"); // users | posts | albums | reports
  const [editing, setEditing] = useState(null); // "type:id" of the row being edited
  const [confirming, setConfirming] = useState(null); // "type:id" awaiting delete confirmation
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const isAdmin = viewer && viewer.role === "admin";

  async function load() {
    try {
      if (!viewerId) return;

      const [viewerRes, usersRes, postsRes, albumsRes, reportsRes] = await Promise.all([
        fetch(`${API}/api/users/${viewerId}`),
        fetch(`${API}/api/users`),
        fetch(`${API}/api/posts`),
        fetch(`${API}/api/albums`),
        fetch(`${API}/api/reports`),
      ]);

      if (viewerRes.ok) setViewer(await viewerRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (albumsRes.ok) setAlbums(await albumsRes.json());
      if (reportsRes.ok) {
        const list = await reportsRes.json();
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReports(list);
      }
      if (postsRes.ok) {
        const list = await postsRes.json();
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(list);
      }
    } catch {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(type, id) {
    try {
      const response = await fetch(`${API}/api/${ENDPOINTS[type]}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return setError(data.error || `Failed to delete ${type}`);
      }

      setError("");
      setConfirming(null);
      load();
    } catch {
      setError("Could not connect to the server");
    }
  }

  function finishEditing() {
    setEditing(null);
    load();
  }

  // ---------- small UI helpers ----------
  function tabClass(name) {
    return `px-4 py-2 cursor-pointer ${tab === name ? "bg-black text-white" : "bg-gray-200"}`;
  }

  function editButton(type, id) {
    const key = `${type}:${id}`;

    return (
      <button
        className="bg-gray-900 text-white p-2 cursor-pointer"
        onClick={() => setEditing(editing === key ? null : key)}
      >
        {editing === key ? "Cancel" : "Edit"}
      </button>
    );
  }

  function deleteButton(type, id, label = "Delete") {
    const key = `${type}:${id}`;

    if (confirming === key) {
      return (
        <>
          <button
            className="bg-red-600 text-white p-2 cursor-pointer"
            onClick={() => remove(type, id)}
          >
            Confirm
          </button>
          <button className="p-2 cursor-pointer" onClick={() => setConfirming(null)}>
            Keep
          </button>
        </>
      );
    }

    return (
      <button
        className="bg-red-600 text-white p-2 cursor-pointer"
        onClick={() => setConfirming(key)}
      >
        {label}
      </button>
    );
  }

  function row(key, info, actions, editor) {
    return (
      <div key={key} className="border border-gray-400 bg-gray-200 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">{info}</div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
        {editor}
      </div>
    );
  }

  const usersById = Object.fromEntries(users.map((u) => [u._id, u]));
  const postsById = Object.fromEntries(posts.map((p) => [p._id, p]));

  const username = (id) => (usersById[id] ? `@${usersById[id].username}` : "unknown user");

  // ---------- tabs ----------
  function renderUsers() {
    if (users.length === 0) return <p>No users</p>;

    return users.map((user) => {
      const key = `user:${user._id}`;

      return row(
        key,
        <>
          <img
            src={user.profile_pic ? API + user.profile_pic : "/default-avatar.png"}
            alt={user.username}
            className="h-12 w-12 object-cover"
          />
          <div>
            <Link to={`/profile/${user._id}`} className="font-bold">
              @{user.username}
            </Link>
            <p>{user.name} · {user.email}</p>
          </div>
        </>,
        <>
          {editButton("user", user._id)}
          {user._id !== viewerId && deleteButton("user", user._id)}
        </>,
        editing === key && (
          <EditProfile profile={user} userId={user._id} onSaved={finishEditing} />
        )
      );
    });
  }

  function renderPosts() {
    if (posts.length === 0) return <p>No posts</p>;

    return posts.map((post) => {
      const key = `post:${post._id}`;

      return row(
        key,
        <>
          <img src={API + post.img_link} alt={post.caption} className="h-16 w-16 object-cover" />
          <div>
            <Link to={`/post/${post._id}`} className="font-bold">
              {post.caption}
            </Link>
            <p>by {username(post.user_id)} · {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </>,
        <>
          {editButton("post", post._id)}
          {deleteButton("post", post._id)}
        </>,
        editing === key && (
          <EditPost post={post} onUpdated={finishEditing} onDeleted={finishEditing} />
        )
      );
    });
  }

  function renderAlbums() {
    if (albums.length === 0) return <p>No albums</p>;

    return albums.map((album) => {
      const key = `album:${album._id}`;
      const albumPosts = posts.filter((p) => p.album_id === album._id);

      return row(
        key,
        <div>
          <Link to={`/album/${album._id}`} className="font-bold">
            {album.album_name}
          </Link>
          <p>{album.description}</p>
          <p>by {username(album.user_id)} · {albumPosts.length} posts</p>
        </div>,
        <>
          {editButton("album", album._id)}
          {deleteButton("album", album._id)}
        </>,
        editing === key && (
          <EditAlbum album={album} albumPosts={albumPosts} onSaved={finishEditing} />
        )
      );
    });
  }

  function renderReports() {
    if (reports.length === 0) return <p>No reported posts</p>;

    return reports.map((report) => {
      const post = postsById[report.post_id];

      return row(
        `report:${report._id}`,
        <>
          {post ? (
            <img src={API + post.img_link} alt={post.caption} className="h-16 w-16 object-cover" />
          ) : (
            <div className="h-16 w-16 bg-gray-300" />
          )}
          <div>
            {post ? (
              <Link to={`/post/${post._id}`} className="font-bold">
                {post.caption}
              </Link>
            ) : (
              <p className="font-bold">Post no longer exists</p>
            )}
            <p>Reported by {username(report.user_id)} · {new Date(report.createdAt).toLocaleDateString()}</p>
            <p>Reason: {report.reason}</p>
          </div>
        </>,
        <>
          {post && deleteButton("post", post._id, "Delete post")}
          {deleteButton("report", report._id, "Dismiss")}
        </>
      );
    });
  }

  // ---------- render ----------
  let content;

  if (loading) {
    content = <p className="m-5">Loading...</p>;
  } else if (!viewerId || !isAdmin) {
    content = <p className="m-5">You do not have access to this page</p>;
  } else {
    content = (
      <div className="m-5">
        <p className="text-2xl font-bold">Admin</p>

        <div className="flex gap-2 my-5">
          <button className={tabClass("users")} onClick={() => setTab("users")}>
            Users ({users.length})
          </button>
          <button className={tabClass("posts")} onClick={() => setTab("posts")}>
            Posts ({posts.length})
          </button>
          <button className={tabClass("albums")} onClick={() => setTab("albums")}>
            Albums ({albums.length})
          </button>
          <button className={tabClass("reports")} onClick={() => setTab("reports")}>
            Reports ({reports.length})
          </button>
        </div>

        {error && <p className="my-3">{error}</p>}

        <div className="flex flex-col gap-2">
          {tab === "users" && renderUsers()}
          {tab === "posts" && renderPosts()}
          {tab === "albums" && renderAlbums()}
          {tab === "reports" && renderReports()}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 min-h-screen h-full">
      <Navigation />
      {content}
    </div>
  );
}
import { useEffect, useState } from "react";
import { PostPreview } from "../components/PostPreview";
import { getCookie } from "../utils/cookies";

const API = "http://localhost:3001";

// posts reported more than this many times are hidden from the feed
const REPORT_LIMIT = 2;

export function Feed() {
  const viewerId = getCookie("userId");

  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [reportCounts, setReportCounts] = useState({}); // { post_id: count }
  const [mode, setMode] = useState("global"); // "global" | "local"
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      setLoading(true);

      // friends are only fetched when someone is signed in
      const [postsRes, friendsRes, countsRes] = await Promise.all([
        fetch(`${API}/api/posts`),
        viewerId ? fetch(`${API}/api/friends/u/${viewerId}`) : null,
        fetch(`${API}/api/reports/counts`),
      ]);

      if (!postsRes.ok) {
        setErrors({ form: "Error getting posts" });
        return;
      }

      const data = await postsRes.json();
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(data);

      if (friendsRes && friendsRes.ok) {
        setFriends(await friendsRes.json());
      }

      if (countsRes.ok) {
        setReportCounts(await countsRes.json());
      }
    } catch {
      setErrors({ form: "Could not connect to the server" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // ids of accepted friends (the other side of each friend record)
  const friendIds = new Set(
    friends
      .filter((f) => f.status === "accepted")
      .map((f) => (f.user_id === viewerId ? f.friend_id : f.user_id))
  );

  // hide posts that have been reported too many times
  const notHidden = posts.filter((p) => (reportCounts[p._id] || 0) <= REPORT_LIMIT);

  const visiblePosts =
    mode === "local" ? notHidden.filter((p) => friendIds.has(p.user_id)) : notHidden;

  function tabClass(tab) {
    return `px-4 py-2 cursor-pointer ${
      mode === tab ? "bg-black text-white" : "bg-gray-300"
    }`;
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 m-5">
        <button className={tabClass("global")} onClick={() => setMode("global")}>
          Global
        </button>
        <button className={tabClass("local")} onClick={() => setMode("local")}>
          Local
        </button>
      </div>

      <div className="grid grid-cols-3 w-full">
        {loading && <p className="col-span-3">Loading...</p>}
        {errors.form && <p className="col-span-3">{errors.form}</p>}

        {!loading && mode === "local" && !viewerId && (
          <p className="col-span-3">Sign in to see your friends' posts</p>
        )}

        {!loading &&
          !errors.form &&
          (mode === "global" || viewerId) &&
          visiblePosts.length === 0 && (
            <p className="col-span-3">
              {mode === "local" ? "No posts from your friends yet" : "No posts yet"}
            </p>
          )}

        {visiblePosts.map((post) => (
          <PostPreview post={post} key={post._id} />
        ))}
      </div>
    </div>
  );
}
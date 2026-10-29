import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserPosts } from "../components/UserPosts";
import { EditProfile } from "../components/EditProfile";
import { getCookie } from "../utils/cookies";
import { API } from "../config";

export function Profile() {
  const { id } = useParams();
  const viewerId = getCookie("userId");
  const isOwnProfile = viewerId === id;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  async function load() {
    try {
      const [userRes, postsRes, friendsRes] = await Promise.all([
        fetch(`${API}/api/users/${id}`),
        fetch(`${API}/api/posts/u/${id}`),
        fetch(`${API}/api/friends/u/${id}`),
      ]);

      if (!userRes.ok) {
        const data = await userRes.json();
        setError(data.error || "Error getting profile");
        return;
      }

      setError("");
      setProfile(await userRes.json());
      if (postsRes.ok) setPosts(await postsRes.json());
      if (friendsRes.ok) setFriends(await friendsRes.json());
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

  // ---------- friends ----------
  const acceptedCount = friends.filter((f) => f.status === "accepted").length;

  // the record between the viewer and this profile, if any
  const relation = friends.find(
    (f) =>
      (f.user_id === viewerId && f.friend_id === id) ||
      (f.user_id === id && f.friend_id === viewerId)
  );

  async function sendRequest() {
    await fetch(`${API}/api/friends`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: viewerId, friend_id: id }),
    });
    load();
  }

  async function acceptRequest() {
    await fetch(`${API}/api/friends/${relation._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "accepted" }),
    });
    load();
  }

  // unfriend, cancel a sent request, or decline a received one
  async function removeRelation() {
    await fetch(`${API}/api/friends/${relation._id}`, { method: "DELETE" });
    load();
  }

  function renderFriendButton() {
    if (!viewerId) return null;

    if (!relation) {
      return <button className=" bg-gray-900 text-white p-2 my-2 cursor-pointer" onClick={sendRequest}>Add friend</button>;
    }

    if (relation.status === "accepted") {
      return <button onClick={removeRelation}>Unfriend</button>;
    }

    // pending
    if (relation.user_id === viewerId) {
      return <button onClick={removeRelation}>Request sent (cancel)</button>;
    }

    return (
      <>
        <button onClick={acceptRequest}>Accept request</button>
        <button onClick={removeRelation}>Decline</button>
      </>
    );
  }

  // ---------- render ----------
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return null;

  return (
    <div className="m-20">
      <img
        src={profile.profile_pic ? API + profile.profile_pic : "/default-avatar.png"}
        alt={profile.username}
        width="120"
      />

      <p>{profile.name}</p>
      <p>@{profile.username}</p>
      <p>{acceptedCount} {acceptedCount === 1 ? "friend" : "friends"}</p>
      <p>{profile.bio}</p>

      {isOwnProfile ? (
        <button onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : "Edit profile"}
        </button>
      ) : (
        renderFriendButton()
      )}

      {editing && (
        <EditProfile
          profile={profile}
          userId={id}
          onSaved={() => {
            setEditing(false);
            load();
          }}
        />
      )}

      <hr />

      <UserPosts posts={posts} />
    </div>
  );
}
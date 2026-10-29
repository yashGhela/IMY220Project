import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { UserPosts } from "../components/UserPosts";
import { EditProfile } from "../components/EditProfile";
import { ProfileHeader } from "../components/ProfileHeader";
import { FriendButton } from "../components/FriendButton";
import { FriendsList } from "../components/FriendsList";
import { getCookie } from "../utils/cookies";
import { API } from "../config";

export function Profile() {
  const { id } = useParams();
  const viewerId = getCookie("userId");
  const isOwnProfile = viewerId === id;

  const [profile, setProfile] = useState(null);
  const [friendships, setFriendships] = useState([]); // friend records involving this profile
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [userRes, friendsRes, usersRes] = await Promise.all([
        fetch(`${API}/api/users/${id}`),
        fetch(`${API}/api/friends/u/${id}`),
        fetch(`${API}/api/users`),
      ]);

      if (!userRes.ok) {
        const data = await userRes.json().catch(() => ({}));
        setError(data.error || "Error getting profile");
        return;
      }

      setError("");
      setProfile(await userRes.json());
      if (friendsRes.ok) setFriendships(await friendsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
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

  // the record between the viewer and this profile, if any
  const relation = friendships.find(
    (f) =>
      (f.user_id === viewerId && f.friend_id === id) ||
      (f.user_id === id && f.friend_id === viewerId)
  );

  // only the owner and accepted friends can see the full profile
  const canViewFull = isOwnProfile || (relation && relation.status === "accepted");

  const acceptedCount = friendships.filter((f) => f.status === "accepted").length;

  // posts and albums are only fetched when the viewer is allowed to see them
  useEffect(() => {
    if (!canViewFull) {
      setPosts([]);
      setAlbums([]);
      return;
    }

    async function loadContent() {
      try {
        const [postsRes, albumsRes] = await Promise.all([
          fetch(`${API}/api/posts/u/${id}`),
          fetch(`${API}/api/albums/u/${id}`),
        ]);

        if (postsRes.ok) setPosts(await postsRes.json());
        if (albumsRes.ok) setAlbums(await albumsRes.json());
      } catch {
        setError("Could not connect to the server");
      }
    }

    loadContent();
  }, [id, canViewFull]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return null;

  return (
    <div className="m-20">
      <ProfileHeader profile={profile} full={canViewFull} friendCount={acceptedCount}>
        {isOwnProfile ? (
          <button onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit profile"}
          </button>
        ) : (
          viewerId && (
            <FriendButton
              viewerId={viewerId}
              profileId={id}
              relation={relation}
              onChanged={load}
            />
          )
        )}
      </ProfileHeader>

      {isOwnProfile && editing && (
        <EditProfile
          profile={profile}
          userId={id}
          onSaved={() => {
            setEditing(false);
            load();
          }}
        />
      )}

      {!canViewFull && (
        <p className="my-5">
          {viewerId
            ? `Become friends with ${profile.name} to see their profile.`
            : `Log in and add ${profile.name} as a friend to see their profile.`}
        </p>
      )}

      {canViewFull && (
        <>
          <hr />

          <FriendsList friendships={friendships} profileId={id} users={users} />

          <div className="flex flex-row gap-4 overflow-x-auto my-5">
            {albums.length === 0 && <p>No albums yet</p>}

            {albums.map((album) => (
              <Link key={album._id} to={`/album/${album._id}`} className="shrink-0">
                {album.album_name}
              </Link>
            ))}
          </div>

          <UserPosts posts={posts} />
        </>
      )}
    </div>
  );
}
import { Link } from "react-router-dom";
import { API } from "../config";

// friendships = friend records involving this profile, users = all users
export function FriendsList({ friendships, profileId, users }) {
  const usersById = Object.fromEntries(users.map((u) => [u._id, u]));

  const friends = friendships
    .filter((f) => f.status === "accepted")
    .map((f) => usersById[f.user_id === profileId ? f.friend_id : f.user_id])
    .filter(Boolean);

  return (
    <div className="my-5">
      <p className="font-bold">Friends</p>

      {friends.length === 0 && <p>No friends yet</p>}

      <div className="flex flex-row flex-wrap gap-4 my-2">
        {friends.map((friend) => (
          <Link key={friend._id} to={`/profile/${friend._id}`} className="flex items-center gap-2">
            <img
              src={friend.profile_pic ? API + friend.profile_pic : "/default-avatar.png"}
              alt={friend.name}
              className="h-10 w-10 object-cover"
            />
            <span>{friend.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
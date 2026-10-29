import { API } from "../config";

// full = false shows only the name and profile picture (viewer is not a friend)
export function ProfileHeader({ profile, full, friendCount, children }) {
  return (
    <div>
      <img
        src={profile.profile_pic ? API + profile.profile_pic : "/default-avatar.png"}
        alt={profile.name}
        width="120"
      />

      <p className="font-bold">{profile.name}</p>

      {full && (
        <>
          <p>@{profile.username}</p>
          <p>{friendCount} {friendCount === 1 ? "friend" : "friends"}</p>
          <p>{profile.bio}</p>
        </>
      )}

      {children}
    </div>
  );
}
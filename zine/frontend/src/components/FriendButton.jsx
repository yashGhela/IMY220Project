import { useState } from "react";
import { API } from "../config";

// relation = the friend record between the viewer and this profile (or undefined)
export function FriendButton({ viewerId, profileId, relation, onChanged }) {
  const [error, setError] = useState("");

  async function send(url, options) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return setError(data.error || "Something went wrong");
      }

      setError("");
      onChanged();
    } catch {
      setError("Could not connect to the server");
    }
  }

  const sendRequest = () =>
    send(`${API}/api/friends`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: viewerId, friend_id: profileId }),
    });

  const acceptRequest = () =>
    send(`${API}/api/friends/${relation._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "accepted" }),
    });

  // unfriend, cancel a sent request, or decline a received one
  const removeRelation = () =>
    send(`${API}/api/friends/${relation._id}`, { method: "DELETE" });

  let buttons;

  if (!relation) {
    buttons = (
      <button className="bg-gray-900 text-white p-2 my-2 cursor-pointer" onClick={sendRequest}>
        Add friend
      </button>
    );
  } else if (relation.status === "accepted") {
    buttons = <button onClick={removeRelation}>Unfriend</button>;
  } else if (relation.user_id === viewerId) {
    buttons = <button onClick={removeRelation}>Request sent (cancel)</button>;
  } else {
    buttons = (
      <>
        <button className="bg-gray-900 text-white p-2 my-2 cursor-pointer" onClick={acceptRequest}>
          Accept request
        </button>
        <button className="p-2 cursor-pointer" onClick={removeRelation}>
          Decline
        </button>
      </>
    );
  }

  return (
    <div>
      {buttons}
      {error && <p>{error}</p>}
    </div>
  );
}
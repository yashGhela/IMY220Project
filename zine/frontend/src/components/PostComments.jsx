import { useState } from "react";

export function PostComments({ comments, users, currentUserId, onAdd, onDelete }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim()) {
      setError("Comment can't be empty");
      return;
    }

    if (!currentUserId) {
      setError("You need to be signed in to comment");
      return;
    }

    const result = await onAdd(text.trim());

    if (result) {
      setError(result);
    } else {
      setError("");
      setText("");
    }
  }

  return (
    <div>
      <p>Comments ({comments.length})</p>

      {comments.map((c) => (
        <div key={c._id}>
          <p>
            {users[c.user_id] ? users[c.user_id].username : "Unknown user"}
            {" · "}
            {new Date(c.timestamp).toLocaleString()}
          </p>
          <p>{c.comment}</p>
          {c.user_id === currentUserId && (
            <button type="button" onClick={() => onDelete(c._id)}>Delete</button>
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Comment</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
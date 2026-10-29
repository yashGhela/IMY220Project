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
      <p className=" font-bold mt-5">Comments ({comments.length})</p>

      <form className="my-10" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          className=" w-100 no-underline  text-lg  border border-gray-400  bg-gray-300  p-2 my-2"
          onChange={(e) => setText(e.target.value)}
        />
        <button className="bg-black hover:bg-blue-700 p-3 text-white cursor-pointer ml-2" type="submit">Comment</button>
        {error && <p>{error}</p>}
      </form>

      {comments.map((c) => (
        <div className="my-10" key={c._id}>
          <p className="font-bold">
            @{users[c.user_id] ? users[c.user_id].username : "Unknown user"}
            {" · "}
            {new Date(c.timestamp).toLocaleString()}
          </p>
          <p>{c.comment}</p>
          {c.user_id === currentUserId && (
            <button className="italic text-red-500 cursor-pointer" type="button" onClick={() => onDelete(c._id)}>Delete</button>
          )}
        </div>
      ))}

      
    </div>
  );
}
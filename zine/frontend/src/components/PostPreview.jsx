import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";

export function PostPreview({ post }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("Unknown user");
  const [commentCount, setCommentCount] = useState(0);

  async function getUsername() {
    try {
      const res = await fetch(`${API}/api/users`);
      if (!res.ok) return;

      const list = await res.json();
      const users = Object.fromEntries(list.map((u) => [u._id, u]));
      const creator = users[post.user_id];

      if (creator) setUsername(creator.username);
    } catch {
      // keep the default "Unknown user"
    }
  }

  async function getCommentCount() {
    try {
      const res = await fetch(`${API}/api/comments/post/${post._id}`);
      if (!res.ok) return;

      const comments = await res.json();
      setCommentCount(comments.length);
    } catch {
      // keep the default 0
    }
  }

  useEffect(() => {
    getUsername();
    getCommentCount();
  }, [post._id, post.user_id]);

  return (
    <div
      onClick={() => navigate(`/post/${post._id}`)}
      className="font-sans items-center justify-center w-full cursor-pointer  p-10"
    >

        <p className=" font-heading font-black">@{username}</p>
      <img className="mt-2" src={API + post.img_link} />
      
      <p className="text-sm italic">
          {(d => `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`)(new Date(post.createdAt))}
        </p>
      <p className="mt-2">{post.caption}</p>
      <p className="text-gray-400 mt-2">{commentCount}</p>
    </div>
  );
}
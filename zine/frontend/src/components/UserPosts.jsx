import { Link } from "react-router-dom";
import { API } from "../config";

export function UserPosts({ posts }) {
  if (posts.length === 0) return <p>No posts yet</p>;

  return (
    <div className="grid grid-cols-3 mt-4 gap-2">
      {posts.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`}>
          <img src={API + post.img_link} alt={post.caption} />
          <p className="text-sm italic">
          {(d => `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`)(new Date(post.createdAt))}
        </p>
          <p className="mt-3">{post.caption}</p>
        </Link>
      ))}
    </div>
  );
}
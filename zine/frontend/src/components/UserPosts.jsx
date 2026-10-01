import { Link } from "react-router-dom";
import { API } from "../config";

export function UserPosts({ posts }) {
  if (posts.length === 0) return <p>No posts yet</p>;

  return (
    <div className="grid grid-cols-3 gap-2">
      {posts.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`}>
          <img src={API + post.img_link} alt={post.caption} />
        </Link>
      ))}
    </div>
  );
}
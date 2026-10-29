import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostImage } from "../components/PostImage";
import { PostComments } from "../components/PostComments";
import { EditPost } from "../components/EditPost";
import { getCookie } from "../utils/cookies";
import { API } from "../config";
import { ReportPost } from "./ReportPost";

export function Post() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [users, setUsers] = useState({}); // { userId: user }
  const [comments, setComments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = getCookie("userId");

  useEffect(() => {
    async function loadPost() {
      try {
        const [postRes, usersRes, commentsRes] = await Promise.all([
          fetch(`${API}/api/posts/${id}`),
          fetch(`${API}/api/users`),
          fetch(`${API}/api/comments/post/${id}`),
        ]);

        if (!postRes.ok) {
          const data = await postRes.json();
          setError(data.error || "Error getting post");
          return;
        }

        setPost(await postRes.json());

        if (usersRes.ok) {
          const list = await usersRes.json();
          setUsers(Object.fromEntries(list.map((u) => [u._id, u])));
        }

        if (commentsRes.ok) {
          setComments(await commentsRes.json());
        }
      } catch {
        setError("Could not connect to the server");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  async function handleAddComment(text) {
    const response = await fetch(`${API}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, post_id: id, comment: text }),
    });

    const data = await response.json();

    if (!response.ok) return data.error || "Failed to add comment";

    setComments([
      ...comments,
      { _id: data._id, user_id: userId, post_id: id, comment: text, timestamp: data.timestamp },
    ]);
    return "";
  }

  async function handleDeleteComment(commentId) {
    const response = await fetch(`${API}/api/comments/${commentId}`, { method: "DELETE" });

    if (response.ok) {
      setComments(comments.filter((c) => c._id !== commentId));
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return null;

  const creator = users[post.user_id];
  const isOwner = userId === post.user_id;

  return (
    <div className="mt-10 mx-40">
      <div onClick={()=>{navigate(`/Profile/${creator._id}`)}} className=" cursor-pointer flex my-5">
        <img className=" h-10 w-10 " src={API+creator.profile_pic} alt="" />
      <p className=" py-2 ml-5 font-black text-lg">@{creator ? creator.username : "Unknown user"}</p>

      </div>
      <PostImage img={API + post.img_link} />
      <p className="text-sm italic">
          {(d => `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`)(new Date(post.createdAt))}
        </p>
      <p className="mt-5 font-light">{post.caption}</p>
      {userId && !isOwner && <ReportPost postId={id} />}

      {isOwner && (
        <button onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : "Edit post"}
        </button>
      )}

      {editing && (
        <EditPost
          post={post}
          onUpdated={(updated) => {
            setPost(updated);
            setEditing(false);
          }}
          onDeleted={() => navigate("/")}
        />
      )}

      <hr />
      <PostComments
        comments={comments}
        users={users}
        currentUserId={userId}
        onAdd={handleAddComment}
        onDelete={handleDeleteComment}
      />
    </div>
  );
}
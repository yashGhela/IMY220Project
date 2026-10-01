import { useState } from "react";
import { getCookie } from "../utils/cookies";

const API = "http://localhost:3001";

export function EditPost({ post, onUpdated, onDeleted }) {
  const [imgFile, setImgFile] = useState(null);
  const [caption, setCaption] = useState(post.caption);
  const [errors, setErrors] = useState({});


  if (getCookie("userId") !== post.user_id) return null;

  function validateImage(file) {
    if (!file) return ""; // optional when editing
    if (!file.type.startsWith("image/")) return "Only image files are allowed";
    if (file.size > 5 * 1024 * 1024) return "Image must be 5MB or smaller";
    return "";
  }

  function validateCaption(value) {
    if (!value.trim()) return "Caption is required";
    if (value.trim().length > 200) return "Caption must be 200 characters or fewer";
    return "";
  }

  async function handleSave(event) {
    event.preventDefault();

    const imageError = validateImage(imgFile);
    const captionError = validateCaption(caption);
    setErrors({ image: imageError, caption: captionError });
    if (imageError || captionError) return;

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (imgFile) formData.append("image", imgFile);

      const response = await fetch(`${API}/api/posts/${post._id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setImgFile(null);
        setErrors({ form: "Post updated!" });
        if (onUpdated) onUpdated({ ...post, caption: data.caption, img_link: data.img_link });
      } else {
        setErrors({ form: data.error });
      }
    } catch {
      setErrors({ form: "Could not connect to the server" });
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this post? This can't be undone.")) return;

    try {
      const response = await fetch(`${API}/api/posts/${post._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        if (onDeleted) onDeleted(post._id);
      } else {
        setErrors({ form: data.error });
      }
    } catch {
      setErrors({ form: "Could not connect to the server" });
    }
  }

  return (
    <form onSubmit={handleSave}>
      <p>Change picture</p>
      <img
        src={imgFile ? URL.createObjectURL(imgFile) : API + post.img_link}
        alt="Post preview"
        width="200"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImgFile(e.target.files[0] || null)}
      />
      {errors.image && <p>{errors.image}</p>}

      <p>Change caption</p>
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      {errors.caption && <p>{errors.caption}</p>}

      {errors.form && <p>{errors.form}</p>}

      <button type="submit">Save</button>
      <button type="button" onClick={handleDelete}>Delete post</button>
    </form>
  );
}

// How to use:

{/* <EditPost
  post={post}
  onUpdated={(updated) => setPost(updated)}
  onDeleted={() => navigate("/profile")}   // or remove it from your posts list state
/> */}
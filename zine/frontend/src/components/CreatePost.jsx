import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookies";
import { useNavigate } from "react-router-dom";

export function CreatePost() {
  const [imgfile, setImgFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState("");
  const navigate = useNavigate()

  function validateImage(file) {
    if (!file) return "Please choose an image";

    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed";
    }

    if (file.size > 5 * 1024 * 1024) {
      return "Image must be 5MB or smaller";
    }

    return "";
  }

  function validateCaption(value) {
    if (!value.trim()) return "Caption is required";

    if (value.trim().length > 200) {
      return "Caption must be 200 characters or fewer";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const imageError = validateImage(imgfile);
    const captionError = validateCaption(caption);

    setErrors({
      image: imageError,
      caption: captionError,
    });

    if (imageError || captionError) return;

    const userId = getCookie("userId");
    if (!userId) {
      setErrors({ form: "You need to be signed in to post" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", imgfile); // must match upload.single("image")
      formData.append("caption", caption);
      formData.append("user_id", userId);

      const response = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        body: formData, // no Content-Type header, the browser sets it
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Post created:", data);
        setImgFile(null);
        setCaption("");
        setErrors({ form: "Post created!" });
        navigate('/home')

        event.target.reset(); // clears the file input
      } else {
        setErrors({ form: data.error });
      }
    } catch {
      setErrors({ form: "Could not connect to the server" });
    }
  }

  useEffect(() => {
  if (!imgfile) {
    setPreview("");
    return;
  }

  const url = URL.createObjectURL(imgfile);
  setPreview(url);

  return () => URL.revokeObjectURL(url); // free memory when the file changes
}, [imgfile]);

  return (
    <form className="items-center  rounded-2xl border w-96  border-gray-600 p-5  m-20 text-center justify-center" onSubmit={handleSubmit}>
      
   <label className=" flex h-64  cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-gray-400 bg-gray-200">
  {preview ? (
    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
  ) : (
    <span className="text-gray-600">Add a file</span>
  )}

  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => setImgFile(e.target.files[0] || null)}
  />
</label>
{errors.image && <p>{errors.image}</p>}
      


 <br/>

     
      <textarea
        className="border border-gray-400   p-5  w-full bg-gray-300  resize-y "
        value={caption}
        placeholder="Type Caption Here"
        onChange={(e) => {
          setCaption(e.target.value);
        }}
        type="text"
      />
      {errors.caption && <p>{errors.caption}</p>}

      {errors.form && <p>{errors.form}</p>}

      <br/>
      <button className=" bg-black p-2 w-full cursor-pointer my-10 hover:bg-blue-700  text-white " type="submit">Post</button>
    </form>
  );
}
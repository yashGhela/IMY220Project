import { useState } from "react";
import { getCookie } from "../utils/cookies";
import { useNavigate } from "react-router-dom";

export function CreatePost() {
  const [imgfile, setImgFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [errors, setErrors] = useState({});

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

  return (
    <form className="items-center my-20 text-center justify-center" onSubmit={handleSubmit}>
      <p className="my-10 font-bold text-neutral-600">Place image here</p>
      <input
        class=" w-fit text-sm text-gray-600 border border-gray-300  cursor-pointer  focus:outline-none file:bg-neutral-400 file:text-white file:border-0 file:py-2.5 file:px-4 file:mr-4 file:hover:bg-neutral-800 file:cursor-pointer"
        onChange={(e) => {
          setImgFile(e.target.files[0]);
        }}
        type="file"
        accept="image/*"
      />
      {errors.image && <p>{errors.image}</p>}



      <p className="my-10">Type caption here</p>
      <input
        className="border border-gray-300 p-1"
        value={caption}
        onChange={(e) => {
          setCaption(e.target.value);
        }}
        type="text"
      />
      {errors.caption && <p>{errors.caption}</p>}

      {errors.form && <p>{errors.form}</p>}

      <br/>
      <button className=" bg-black p-2 cursor-pointer my-10  text-white w-24" type="submit">Post</button>
    </form>
  );
}
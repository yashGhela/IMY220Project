import { useState } from "react";
import { getCookie } from "../utils/cookies";
import { API } from "../config";

export function CreateAlbum({ onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  function validateName(value) {
    if (!value.trim()) return "Album name is required";

    if (value.trim().length > 50) {
      return "Album name must be 50 characters or fewer";
    }

    return "";
  }

  function validateDescription(value) {
    if (!value.trim()) return "Description is required";

    if (value.trim().length > 200) {
      return "Description must be 200 characters or fewer";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nameError = validateName(name);
    const descriptionError = validateDescription(description);

    setErrors({
      name: nameError,
      description: descriptionError,
    });

    if (nameError || descriptionError) return;

    const userId = getCookie("userId");
    if (!userId) {
      setErrors({ form: "You need to be signed in to create an album" });
      return;
    }

    try {
      const response = await fetch(`${API}/api/albums`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          album_name: name,
          description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setName("");
        setDescription("");
        setErrors({ form: "Album created!" });

        if (onCreated) {
          onCreated({
            _id: data._id,
            user_id: userId,
            album_name: name.trim(),
            description: description.trim(),
          });
        }
      } else {
        setErrors({ form: data.error });
      }
    } catch {
      setErrors({ form: "Could not connect to the server" });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Album name</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors.name && <p>{errors.name}</p>}

      <p>Description</p>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {errors.description && <p>{errors.description}</p>}

      {errors.form && <p>{errors.form}</p>}

      <button type="submit">Create album</button>
    </form>
  );
}
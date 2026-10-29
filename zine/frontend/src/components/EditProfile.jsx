import { useEffect, useState } from "react";
import { API } from "../config";

export function EditProfile({ profile, userId, onSaved }) {
  
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [pfpFile, setPfpFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [preview, setPreview] = useState("");

  async function handleSave(event) {
    event.preventDefault();

    if (!name.trim()) return setFormError("Name is required");
    if (!email.trim() || !email.includes("@")) return setFormError("Enter a valid email address");
    if (pfpFile && !pfpFile.type.startsWith("image/")) return setFormError("Only image files are allowed");
    if (pfpFile && pfpFile.size > 5 * 1024 * 1024) return setFormError("Image must be 5MB or smaller");

    try {
      const response = await fetch(`${API}/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ name, email, bio: bio.trim() ? bio : " " }),
      });

      if (!response.ok) {
        const data = await response.json();
        return setFormError(data.error || "Failed to update profile");
      }

      if (pfpFile) {
        const formData = new FormData();
        formData.append("profile_pic", pfpFile); // must match upload.single("profile_pic")

        const picRes = await fetch(`${API}/api/users/${userId}/profile-pic`, {
          method: "PATCH",
          body: formData,
        });

        if (!picRes.ok) {
          const data = await picRes.json();
          return setFormError(data.error || "Failed to update profile picture");
        }
      }

      onSaved();
    } catch {
      setFormError("Could not connect to the server");
    }
  }

  useEffect(() => {
      if (!pfpFile) {
        setPreview("");
        return;
      }
    
      const url = URL.createObjectURL(pfpFile);
      setPreview(url);
    
      return () => URL.revokeObjectURL(url); // free memory when the file changes
    }, [pfpFile]);

  return (
    <form className=" border border-gray-600 p-10" onSubmit={handleSave}>
      <p>Change picture</p>
     <label className=" flex h-64  w-64 my-5 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-gray-400 bg-gray-200">
      {preview ? (
        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
      ) : (
        <span className="text-gray-600">Add a file</span>
      )}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => setPfpFile(e.target.files[0] || null)}
      />
    </label>
  
      <p>Name</p>
      <input className=" w-100 no-underline  text-lg  border border-gray-400  bg-gray-300  p-2 my-2" type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <p>Email</p>
      <input className=" w-100 no-underline  text-lg  border border-gray-400  bg-gray-300  p-2 my-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <p>Bio</p>
      <input className=" w-100 no-underline  text-lg  border border-gray-400  bg-gray-300  p-2 my-2" type="text" value={bio} onChange={(e) => setBio(e.target.value)} />

      {formError && <p>{formError}</p>}

       <br/>
      <button className="bg-black hover:bg-blue-700 p-2 mt-5 text-white" type="submit">Save</button>
    </form>
  );
}
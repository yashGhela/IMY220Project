import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../utils/cookies";

export function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pfpFile, setPfpFile] = useState(null);
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState("")
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  function validateUsername(value) {
    if (!value.trim()) return "Username is required";
    if (value.trim().length < 3) {
      return "Username must be at least 3 characters";
    }
    return "";
  }

  function validatePassword(value) {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 6 characters";
    return "";
  }

  function validateEmail(value) {
    if (!value.trim()) return "Email is required";
    if (!value.includes("@")) return "Enter a valid email address";
    return "";
  }

  function validateName(value) {
    if (!value.trim()) return "Name is required";
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      username: validateUsername(username),
      password: validatePassword(password),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (hasErrors) return;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      if (pfpFile) formData.append("profile_pic", pfpFile); 

      const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        body: formData, 
      });

      const data = await response.json();

      if (data.success) {
        console.log(data.message);
        console.log(data.user);
        setCookie("userId", data.user._id);
        navigate('/home')
      } else {
        setErrors({ form: data.message });
      }
    } catch {
      setErrors({ form: "Could not connect to the server" });
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
    <form class="flex flex-col m-20" onSubmit={handleSubmit}>
              
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
    {errors.image && <p>{errors.image}</p>}

      <input
        type="text"
        placeholder="Tell us your name..."
        value={name}
        className="my-2 text-lg placeholder:underline"
        onChange={(event) => setName(event.target.value)}
      />
      {errors.name && <p>{errors.name}</p>}

      <input
        type="email"
        placeholder="Add your email..."
        value={email}
        className="my-2 text-lg placeholder:underline"
        onChange={(event) => setEmail(event.target.value)}
      />
      {errors.email && <p>{errors.email}</p>}

      <input
        type="password"
        placeholder="And a password..."
        value={password}
        className="my-2 text-lg placeholder:underline"
        onChange={(event) => setPassword(event.target.value)}
      />
      {errors.password && <p>{errors.password}</p>}

      <input
        type="text"
        placeholder="Finally your username..."
        value={username}
        className="my-2 text-lg placeholder:underline"
        onChange={(event) => setUsername(event.target.value)}
      />
      {errors.username && <p>{errors.username}</p>}

      {errors.form && <p>{errors.form}</p>}

      <button class=" bg-black py-2 cursor-pointer hover:bg-blue-700 text-white my-10 w-full" type="submit">Complete</button>
    </form>
  );
}
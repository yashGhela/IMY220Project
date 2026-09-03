import { useState } from "react";

export function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pfpFile, setPfpFile] = useState(null);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  function validateUsername(value) {
    if (!value.trim()) return "Username is required";
    if (value.trim().length < 3) {
      return "Username must be at least 3 characters";
    }
    return "";
  }

  function validatePassword(value) {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
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
      const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          username,
          password,
          profilePictureName: pfpFile ? pfpFile.name : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log(data.message);
        console.log(data.user);
      } else {
        setErrors({ form: data.message });
      }
    } catch {
      setErrors({ form: "Could not connect to the server" });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => setPfpFile(event.target.files[0])}
      />

      <input
        type="text"
        placeholder="Tell us your name..."
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      {errors.name && <p>{errors.name}</p>}

      <input
        type="email"
        placeholder="Add your email..."
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      {errors.email && <p>{errors.email}</p>}

      <input
        type="password"
        placeholder="And a password..."
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {errors.password && <p>{errors.password}</p>}

      <input
        type="text"
        placeholder="Finally your username..."
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      {errors.username && <p>{errors.username}</p>}

      {errors.form && <p>{errors.form}</p>}

      <button type="submit">Complete</button>
    </form>
  );
}
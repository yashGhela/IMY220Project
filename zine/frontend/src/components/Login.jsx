import { useState } from "react"


export function Login(){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    
    function validateUsername(value) {
    if (!value.trim()) return "Username is required";
    if (value.trim().length < 3) return "Username must be at least 3 characters";
    return "";
  }

  function validatePassword(value) {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    setErrors({
      username: usernameError,
      password: passwordError,
    });

    if (!usernameError && !passwordError) {
      console.log("Form is valid");
    }

    const response = await fetch("http://localhost:3001/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

    const data = await response.json();

    if (data.success) {
        console.log(data.message);
        console.log(data.user);
        // navigate("/album"); // optional: redirect after sign-in
    } else {
        setErrors({ form: data.message });
    }
  }


    return(
        <form onSubmit={handleSubmit}>
            <p>username</p>
            <input value={username} onChange={(e)=>{setUsername(e.target.value)}} type="text" />
            <p>password</p>
            <input value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" />


            <button type="submit">Log in</button>
        </form>
    )
}
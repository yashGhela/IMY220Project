import { useState } from "react"


export function Login(){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({});

    
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
        <form class="m-40" onSubmit={handleSubmit}>
            <p>username</p>
            <input placeholder="username" value={username} onChange={(e)=>{setUsername(e.target.value)}} type="text" />
            {errors.username && <p>{errors.username}</p>}

            <p>password</p>
            <input placeholder="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" />

            {errors.password && <p>{errors.password}</p>}


            {errors.form && <p>{errors.form}</p>} <br/>

            <button class=" bg-olive-300 text-white my-10 w-100"  type="submit">Log in</button>
        </form>
    )
}
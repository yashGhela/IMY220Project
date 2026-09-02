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

  function handleSubmit(event) {
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
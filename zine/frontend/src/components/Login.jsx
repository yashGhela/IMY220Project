import { useState } from "react"


export function Login(){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    
    return(
        <form>
            <p>username</p>
            <input type="text" />
            <p>password</p>
            <input type="password" />
        </form>
    )
}
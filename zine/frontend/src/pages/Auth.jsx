
import {Navigation} from "../components/Navigation"

import {Login} from "../components/Login"

import {SignUp} from "../components/Signup"
import { useState } from "react"

export function Auth(){

    const [login, setLogin] = useState(false)

    return(

        <div>

            <Navigation authed={false}/>

            <button class="m-5" onClick={(e)=>{if(login){setLogin(false)}else{setLogin(true)}}}>Change to {login?"Sign Up":"Login"}</button>

            {login?
            <Login/>
            :
            <SignUp/>
            
        }

            
        </div>
        
    )
}
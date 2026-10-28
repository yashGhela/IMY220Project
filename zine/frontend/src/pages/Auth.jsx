
import {Navigation} from "../components/Navigation"

import {Login} from "../components/Login"

import {SignUp} from "../components/Signup"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"

export function Auth(){


   
    const [searchTypes, setSearchType] = useSearchParams();
    const type = searchTypes.get("type") || "SignUp"

    const isLogin = type === "Login";

    const toggleAuthType=()=>{
        setSearchType({type:isLogin? "SignUp": "Login"})
    }

    

    return(

        <div>

            <Navigation />

            <button class="m-5" onClick={toggleAuthType}>Change to {isLogin?"Sign Up":"Login"}</button>

            {isLogin?
            <Login/>
            :
            <SignUp/>
            
        }

            
        </div>
        
    )
}
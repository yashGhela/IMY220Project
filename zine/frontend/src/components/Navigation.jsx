import {Link} from "react-router-dom"
import { getCookie } from "../utils/cookies"
import { useEffect, useState } from "react"

export function Navigation(){

    const [authed, setAuthed] = useState(false)
    const [id, setId] = useState("")
    const isAuthed = ()=>{
        const userid= getCookie("userId")
        setId(userid)
        if (!userid){
            setAuthed(false)
        }else{
            setAuthed(true)
        }
    }

    useEffect(()=>{

        isAuthed()
    },[])

    return(
        <nav className=" flex mx-5">
            <Link to='/' class="font-black">ZINE</Link>
            <ul>

               {authed?
               <div>
                 <Link class="mx-10" to="/home">Home</Link>
                <Link class="mx-10" to={`/profile/${id}`}>Profile</Link>
               </div>:
               <div>
                <Link class="mx-10" to="/auth">Join</Link>
                <Link class="mx-10" to='/auth'>Login</Link>
               </div>
                
                }
            </ul>
        </nav>
    )

}
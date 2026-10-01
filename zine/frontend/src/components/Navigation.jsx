import {Link} from "react-router-dom"
import { getCookie } from "../utils/cookies"

export function Navigation(){

    let authed= false
    const isAuthed = ()=>{
        const id= getCookie("userId")

        if (!id){
            authed=false
        }else{
            authed=true
        }
    }

    return(
        <nav className=" flex mx-5">
            <Link to='/' class="font-black">ZINE</Link>
            <ul>

               {authed?
               <div>
                 <Link class="mx-10" to="/home">Home</Link>
                <Link class="mx-10" to='/profile'>Profile</Link>
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
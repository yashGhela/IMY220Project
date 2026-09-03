import {Link} from "react-router-dom"

export function Navigation({currPage, authed}){

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
import {Link} from "react-router-dom"

export function Navigation({currPage, authed}){

    return(
        <nav>
            <h1>ZINE</h1>
            <ul>

               {authed?
               <div>
                 <Link to="/">Home</Link>
                <Link to='/profile'>Profile</Link>
               </div>:
               <div>
                <Link to="/auth">Join</Link>
                <Link to='/auth'>Login</Link>
               </div>
                
                }
            </ul>
        </nav>
    )

}
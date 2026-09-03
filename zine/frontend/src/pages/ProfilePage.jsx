import {Navigation} from "../components/Navigation"
import {Profile} from "../components/Profile"

export function ProfilePage(){

    return(

       <div>
         <Navigation authed={true}/>

        <Profile />
       </div>
        
    )
}
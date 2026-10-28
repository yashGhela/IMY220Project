import {Navigation} from "../components/Navigation"
import {Profile} from "../components/Profile"

export function ProfilePage(){

    return(

       <div className="bg-gray-300 min-h-screen  h-full">
         <Navigation />

        <Profile />
       </div>
        
    )
}
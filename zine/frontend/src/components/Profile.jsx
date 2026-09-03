import { useState } from "react"
import {UserPosts} from "../components/UserPosts"
import { useParams } from "react-router-dom";

export function Profile(){


    const [profile, setProfile] = useState([]);
     const {id} = useParams()

     
    return(
        <div class="m-20">
            <p>Yash Ghela</p>
            <p>@yashg</p>
            <p>He/Him</p>
            <p>1500 followers</p>

            <p>Photographer from SA</p>

            

            <hr />

           {/* <UserPosts posts={profile.posts}/> */}
        </div>
    )

}
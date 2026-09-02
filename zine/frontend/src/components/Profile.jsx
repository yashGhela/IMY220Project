import { useState } from "react"
import {UserPosts} from "../components/UserPosts"

export function Profile(){


    const [profile, setProfile] = useState([]);
     const {id} = useParams()

    return(
        <div>
            <p>{profile.name}</p>
            <p>{profile.username}</p>
            <p>{profile.pronouns}</p>
            <p>{profile.follower_count}</p>

            <p>{profile.bio}</p>

            

            <hr />

           <UserPosts posts={profile.posts}/>
        </div>
    )

}
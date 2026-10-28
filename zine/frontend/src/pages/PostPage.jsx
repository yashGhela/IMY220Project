import {Navigation} from "../components/Navigation"
import { Post } from "../components/Post"

export function PostPage(){

    return(

     <div className="bg-gray-300 min-h-screen  h-full">
      <Navigation/>

        <Post/>
    </div>
        
        
    )
}
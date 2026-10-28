import { CreatePost } from "../components/CreatePost"
import {Navigation} from "../components/Navigation"

export function CreatePostPage(){

    return(

        <div className="bg-gray-300 min-h-screen  h-full">
        <Navigation/>

        <CreatePost/>
        </div>
        
        
    )
}
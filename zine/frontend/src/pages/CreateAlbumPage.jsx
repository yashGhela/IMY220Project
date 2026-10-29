import { useNavigate } from "react-router-dom"
import { CreateAlbum } from "../components/CreateAlbum"
import { CreatePost } from "../components/CreatePost"
import { EditAlbum } from "../components/EditAlbum"
import {Navigation} from "../components/Navigation"
import { AddPostsToAlbum } from "../components/AddPostToAlbum"
import { useState } from "react"

export function CreateAlbumPage(){

    const navigate = useNavigate()

    const [newAlbum, setNewAlbum] = useState(null)

    return(

        <div className="bg-gray-300 min-h-screen  h-full">
        <Navigation/>

        <div className="items-center justify-center flex">
            <CreateAlbum onCreated={setNewAlbum} />

                {newAlbum && (
                    <AddPostsToAlbum album={newAlbum} onDone={() => setNewAlbum(null)} />
                    )}
        </div>
        </div>
        
        
    )
}
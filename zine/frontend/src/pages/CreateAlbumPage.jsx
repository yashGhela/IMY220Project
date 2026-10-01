import { useNavigate } from "react-router-dom"
import { CreateAlbum } from "../components/CreateAlbum"
import { CreatePost } from "../components/CreatePost"
import { EditAlbum } from "../components/EditAlbum"
import {Navigation} from "../components/Navigation"

export function CreateAlbumPage(){

    const navigate = useNavigate()

    return(

        <>
        <Navigation/>

        <CreateAlbum onCreated={() => navigate('/home')} />

        
        </>
        
        
    )
}
import { CreateAlbum } from "../components/CreateAlbum"
import { CreatePost } from "../components/CreatePost"
import { EditAlbum } from "../components/EditAlbum"
import {Navigation} from "../components/Navigation"

export function CreateAlbumPage(){

    return(

        <>
        <Navigation/>

        <CreateAlbum onCreated={(album) => setAlbums([...albums, album])} />

        <EditAlbum
        album={album}
        onUpdated={(updated) => setAlbum(updated)}
        onDeleted={() => navigate("/profile/" + userId)}
        />
        </>
        
        
    )
}
import { useState } from "react"


export function EditProfile({profile}){

    const[newName, setName] = useState("");


    return(

        <div>

            <p>Change profile picture</p>
            <input type="file" />

            <p>Change name</p>
            <input id="name" />

            <p>Change bio</p>
            <input id="bio" />



            
        </div>
    )
}
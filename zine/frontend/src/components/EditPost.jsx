import { useState } from "react"


export function EditPost({post}){

    

    return(

        <div>

            <p>Change picture</p>
            <input type="file" />

            <p>Change caption</p>
            <input id="name" />


            
        </div>
    )
}
import { useState } from "react"


function createPost(){

    const [imgfile, setImgFile]=useState(null);
    const [caption, setCaption]= useState('');


    return(

        <div>
            <input type="file" />
            <p>Place image here</p>
            <input type="text" />
            <p>Type caption here</p>

            <button>Post</button>
        </div>
    )
}
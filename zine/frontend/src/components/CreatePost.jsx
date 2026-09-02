import { useState } from "react"


export function createPost(){

    const [imgfile, setImgFile]=useState(null);
    const [caption, setCaption]= useState('');


    function validateImage(file) {
    if (!file) return "Please choose an image";

    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed";
    }

    return "";
  }

    function validateCaption(value) {
        if (!value.trim()) return "Caption is required";

        if (value.trim().length > 200) {
        return "Caption must be 200 characters or fewer";
        }

        return "";
    }

    function handleSubmit(event) {
        event.preventDefault();

        const imageError = validateImage(imgFile);
        const captionError = validateCaption(caption);

        setErrors({
        image: imageError,
        caption: captionError,
        });

        if (!imageError && !captionError) {
        console.log("Post is valid:", { imgFile, caption });
        
        }
    }

    return(

        <form onSubmit={handleSubmit}>
            <p>Place image here</p>
            <input onChange={(e)=>{setImgFile(e.target.files[0])}} type="file" accept="image/*" />

            {errors.image && <p>{errors.image}</p>}
            <p>Type caption here</p>
            <input value={caption} onChange={(e)=>{setCaption(e.target.value)}} type="text" />
            {errors.caption && <p>{errors.caption}</p>}
            <button type="submit">Post</button>
        </form>
    )
}
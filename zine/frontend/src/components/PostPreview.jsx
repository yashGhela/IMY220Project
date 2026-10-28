import { useNavigate } from "react-router-dom"
import { API } from "../config";

export function PostPreview({post}){



    const navigate = useNavigate();


    

    return(
        <div onClick={()=>{navigate(`/post/${post._id}`)}} className=" font-sans items-center justify-center  w-1/3 cursor-pointer    m-20 p-20">
            <img src={API+post.img_link || post.img_link || API+"/backend"+post.img_link} />
            <p>{post.username}</p>
            <p>{post.caption}</p>
            <p>{post.commentCount}</p>

        </div>
    )
}
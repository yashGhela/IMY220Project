import {PostImage} from "../components/PostImage"

import {PostComments} from "../components/PostComments"
import { useParams } from "react-router-dom"
import { useState } from "react"


export function Post(){

    const [post, setPost]= useState([])
    const {id} = useParams()

    return(

        <div>
            <p>{post.creator_username}</p>
            <PostImage img={post.img}/>
            <p>{post.caption}</p>

            <PostComments comments = {post.comments}/>
        </div>
    )
}
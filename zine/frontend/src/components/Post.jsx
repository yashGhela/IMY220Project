import {PostImage} from "../components/PostImage"

import {PostComments} from "../components/PostComments"


export function Post({post}){

    return(

        <div>
            <p>{post.creator_username}</p>
            <PostImage img={post.img}/>
            <p>{post.caption}</p>

            <PostComments comments = {post.comments}/>
        </div>
    )
}
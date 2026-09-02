import {PostPreview} from "../components/PostPreview"


export function UserPosts({posts}){

    return (
        <div>
        {posts.map((post)=>{
            <PostPreview post={post} />
        })}
        </div>
    )
}
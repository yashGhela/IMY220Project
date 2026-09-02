import {PostPreview} from "../components/PostPreview"


export function Feed({posts}){
    return (
        <div>
            {posts.map((post)=>{
                <PostPreview post={post}/>
            })}
        </div>
    )
}
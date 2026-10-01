

export function PostPreview({post}){
    return(
        <div className=" font-sans items-center justify-center border  border-lime-200   m-20 p-20">
            <img src={post.img} />
            <p>{post.username}</p>
            <p>{post.caption}</p>
            <p>{post.commentCount}</p>

        </div>
    )
}
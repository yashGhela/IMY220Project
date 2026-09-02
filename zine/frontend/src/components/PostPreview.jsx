

function PostPreview({post}){
    return(
        <div>
            <img src={post.img} />
            <p>{post.username}</p>
            <p>{post.caption}</p>
            <p>{post.commentCount}</p>

        </div>
    )
}
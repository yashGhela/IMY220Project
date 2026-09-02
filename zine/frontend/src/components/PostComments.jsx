

export function PostComments({comments}){

    return(

       <div>
         {comments.map((comment)=>{
            <div>
            <p>{comment.creator_username}</p>
            <p>{comment.content}</p>
            </div>
        })}
       </div>
    )
}
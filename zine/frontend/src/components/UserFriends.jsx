

export function UserFriends({friends}){

    return(
        <div>
            {friends.map((friend)=>{
                <p>{friend.username}</p>
            })}
        </div>
    )
}
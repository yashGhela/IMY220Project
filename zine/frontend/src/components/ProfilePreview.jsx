

export function ProfilePreview({username, pfplink}){

    return(
        <div>
            <img src={pfplink} alt="profile picture" />
            <p>{username}</p>
        </div>
    )
}
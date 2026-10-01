import { useEffect, useState } from "react";
import {PostPreview} from "../components/PostPreview"


const API = "http://localhost:3001";


export function Feed(){



    const [posts, setPosts]= useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    const loadPosts = async()=>{
        try{
            setLoading(true)
            const response = await fetch(`${API}/api/posts`,{
                method:"GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!response.ok){
                setErrors({form: "Error getting posts"})
                return

            }

            const data = await response.json();

            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setPosts(data)
        }catch{
            setErrors({ form: "Could not connect to the server" });
        }finally {
        setLoading(false);
      }
    }

    useEffect(()=>{
        loadPosts()
    },[])

    


    return (
        <div>

            {loading? <p>Loading...</p>:null}
            {errors.form && <p>{errors.form}</p>}

            {posts.length === 0 && !errors.form && <p>No posts yet</p>}

      
            {posts.map((post)=>(
                <PostPreview post={post} key={post._id}/>
            ))}
        </div>
    )
}
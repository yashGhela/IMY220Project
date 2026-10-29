import { useNavigate } from "react-router-dom";
import { Navigation } from "../components/Navigation";


export function NotFound(){

    const navigate = useNavigate()

    return(
        <div>
            <Navigation/>

            <p className="font-bold">Sorry! We don't have this page</p>
            <button onClick={()=>{navigate('/')}} className="bg-black hover:bg-blue-700 text-white mt-5 p-4">Go Home</button>
        </div>
    )
}
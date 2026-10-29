import {Navigation} from "../components/Navigation"

import batman from "../assets/batman.jpeg"
import opp from "../assets/oppenheimer.jpeg"
import int from "../assets/interstellar.jpeg"
import { useNavigate } from "react-router-dom"

export function Splash(){

   const navigate = useNavigate();

    return(

        <div className="bg-gray-300 w-screen h-full   min-h-screen">
            <Navigation/>
        
       <div className="flex gap-2 p-2 mt-10 w-full">

  <div className="flex flex-col flex-1 min-w-0">
    <p className="text-sm font-bold">@chris</p>
    <img className="mt-2 w-full h-64 object-cover" src={int} alt="" />
    <p className="mt-2">Looking for a way home</p>
  </div>

  <div className="flex flex-col flex-1 min-w-0">
    <p className="text-sm font-bold">@allenscott</p>
    <img className="mt-2 w-full h-64 object-cover" src={opp} alt="" />
    <p className="mt-2">Facing the consequences of his actions, Oppenheimer stares out and reflects</p>
  </div>

  <div className="flex flex-col flex-1 min-w-0">
    <p className="text-sm font-bold">@john</p>
    <img className="mt-2 w-full h-64 object-cover" src={batman} alt="" />
    <p className="mt-2">The Batman of Gotham walks out of the fire and faces the Penguin</p>
  </div>

</div>
        <div className="flex  columns-2 mx-20">
            <h1 className=" text-[250px]  font-[1000] text-black">ZINE</h1>
            <div className="mt-30 ml-32 w-full">
                <button onClick={()=>{navigate('/auth?type=SignUp')}} className="bg-black cursor-pointer p-10 w-full text-white font-bold text-2xl">JOIN</button>
                <p className=" text-2xl bottom-0  font-bold">Create. <br/> Challenge. <br/> Innovate.</p>
            </div>
        </div>
        </div>
    )
}
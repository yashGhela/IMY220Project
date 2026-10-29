import {Navigation} from "../components/Navigation"

export function Splash(){

    return(

        <div className="bg-gray-300 w-screen  h-screen">
            <Navigation/>
        
        <div className="flex">


        </div>

        <div className="flex  columns-2">
            <h1 className=" text-[250px]  font-[1000] text-black">ZINE</h1>
            <div className="mt-30" ml-32 w-full>
                <button className="bg-black p-10 w-full text-white font-bold text-2xl">JOIN</button>
                <p className=" text-2xl bottom-0  font-bold">Create. <br/> Challenge. <br/> Innovate.</p>
            </div>
        </div>
        </div>
    )
}
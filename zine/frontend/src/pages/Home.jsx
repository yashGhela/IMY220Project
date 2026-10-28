import { useState } from "react"
import { Feed } from "../components/Feed"
import {Navigation} from "../components/Navigation"
import { SearchItem } from "../components/Search"



export function Home(){

    


    return(

        <div className="bg-gray-300 h-full">
        <Navigation />

        <SearchItem/>

        <Feed/>
        
        </div>
        
    )
}
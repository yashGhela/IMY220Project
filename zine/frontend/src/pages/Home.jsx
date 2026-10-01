import { useState } from "react"
import { Feed } from "../components/Feed"
import {Navigation} from "../components/Navigation"
import { SearchItem } from "../components/Search"



export function Home(){

    


    return(

        <>
        <Navigation />

        <SearchItem/>

        <Feed/>
        
        </>
        
    )
}
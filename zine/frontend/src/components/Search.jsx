import { useState } from "react";


export function SearchItem(){
    const [searchTerm, setSearchTerm]= useState("")

    return(
        <div>
            <input value={searchTerm} placeholder="search" onChange={(e)=>{setSearchTerm(e.target.value)}} />
            <button>Search</button>
        </div>
    )
}
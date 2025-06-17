import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { ButtonNew } from "../components/ui/ButtonNew";
import { Navbar } from "../components/ui/Navbar";

async function getUserRating(user: string) {
    
}

export function SingleUser() {
    const user = localStorage.getItem("primaryUser");
    const navigate=useNavigate()

    if(!user) {
        return <div>Error fetching user</div>;
    }
    
    return (
        <div>
        <Navbar />
        <div className="bg-slate-800 h-screen p-4 text-white">
            <h1>User: {user}</h1>
            <h2 className="mt-4 font-bold">Recent Problems:</h2>
            <Button size='sm' variant='primary' text='get' onClick={()=> navigate("/problemdistributionsingle")}></Button>
            <Button size='sm' variant='secondary' text='get rating change' onClick={()=> navigate("/ratingdistributionsingle")}></Button>
            
        </div>
        
        </div>
    );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { type Submission } from "../types/SubmissionType";
import { SubmissionApi } from "../api/SubmissionApi";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

// async function getUser(user: string): Promise<Submission[]> {
//     const api = SubmissionApi(user)
//     const response = await axios.get(api);
//     return response.data.result as Submission[];
// }

export function MultipleUser() {
    //const [problems,setProblems] = useState<Submission[]>([]);
    const user1 = localStorage.getItem("primaryUser");
    const user2 = localStorage.getItem("secondaryUser");
    const navigate=useNavigate()
    // useEffect(() => {
    //     if (user) {
    //         getUser(user)
    //         .then(setProblems)
    //         .catch((error) => {
    //             console.error("Error fetching user submissions:", error);
    //         });
    //     }
    // }, [user]);

    if(!user1 || !user2) {
        return <div>Error fetching user</div>;
    }
   
    return (
        <div className="bg-cyan-700 h-screen p-4 text-white">
            <h1>User1: {user1}</h1>
            <h1>User2: {user2}</h1>
            <h2 className="mt-4 font-bold">Recent Problems:</h2>
            <Button size='sm' variant='primary' text='get' onClick={()=> navigate("/problemdistributionmultiple")}></Button>
            <Button size='sm' variant='primary' text='get rating change' onClick={()=> navigate("/ratingdistributionmultiple")}></Button>
        </div>
    );
}

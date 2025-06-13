import { useEffect, useState } from "react";
import axios from "axios";
import { type Submission } from "../types/SubmissionType";
import { SubmissionApi } from "../api/SubmissionApi";

async function getUser(user: string): Promise<Submission[]> {
    const api = SubmissionApi(user)
    const response = await axios.get(api);
    return response.data.result as Submission[];
}

export function SingleUser() {
    const [problems,setProblems] = useState<Submission[]>([]);
    const user = localStorage.getItem("primaryUser");

    useEffect(() => {
        if (user) {
            getUser(user)
            .then(setProblems)
            .catch((error) => {
                console.error("Error fetching user submissions:", error);
            });
        }
    }, [user]);

    if(!user) {
        return <div>Error fetching user</div>;
    }

    return (
        <div className="bg-red-700 h-screen p-4 text-white">
            <h1>User: {user}</h1>
            <h2 className="mt-4 font-bold">Recent Problems:</h2>
            <ul className="mt-2 ">
                {problems.map((submission, index) => (
                    <li key={index}>{submission.problem.name}</li>
                ))}
            </ul>
        </div>
    );
}

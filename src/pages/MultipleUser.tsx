import { useEffect, useState } from "react";
import axios from "axios";
import { type Submission } from "../types/SubmissionType";
import { SubmissionApi } from "../api/SubmissionApi";


async function getUser(user: string): Promise<Submission[]> {
    const api = SubmissionApi(user)
    const response = await axios.get(api);
    return response.data.result as Submission[];
}

export function MultipleUser() {
    const [problems1, setProblems1] = useState<Submission[]>([]);
    const [problems2, setProblems2] = useState<Submission[]>([]);
    const user = localStorage.getItem("primaryUser");
    const suser = localStorage.getItem("secondaryUser");
    
    useEffect(() => {
        if(user) {
            getUser(user)
            .then(setProblems1)
            .catch((error) => {
                console.error("Error fetching user submissions:", error);
            });
        }
    }, [user]);

    useEffect(() => {
        if(suser) {
            getUser(suser).then(setProblems2).catch((error) => {
                console.error("Error fetching user submissions:", error);
            });
        }
    }, [suser]);
    if(!user) {
        return <div>Error fetching user</div>;
    }

    return (
        <div className="bg-red-700 full h-screen p-4 text-white">
            <h1>User: {user}</h1>
            <h2 className="mt-4 font-bold">Recent Problems1:</h2>
            <ul className="mt-2 list-disc list-inside">
                {problems1.map((submission, index) => (
                    <li key={index}>{submission.problem.name}</li>
                ))}
            </ul>
            <h1>User: {suser}</h1>
            <h2 className="mt-4 font-bold">Recent Problems1:</h2>
            <ul className="mt-2 list-disc list-inside">
                {problems2.map((submission, index) => (
                    <li key={index}>{submission.problem.name}</li>
                ))}
            </ul>
        </div>
    );
}

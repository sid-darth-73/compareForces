import { useEffect, useState } from "react";
import axios from "axios";

interface Submission {
    id: number;
    contestId: number;
    creationTimeSeconds: number;
    relativeTimeSeconds: number;
    problem: {
        contestId: number;
        index: string;
        name: string;
        type: string;
        points?: number;
        rating?: number;
        tags: string[];
    };
    author: {
        contestId: number;
        members: Array<{ handle: string }>;
        participantType: string;
        ghost: boolean;
        startTimeSeconds?: number;
    };
    programmingLanguage: string;
    verdict?: string;
    testset: string;
    passedTestCount: number;
    timeConsumedMillis: number;
    memoryConsumedBytes: number;
}

async function getUser(user: string): Promise<Submission[]> {
    const response = await axios.get(`https://codeforces.com/api/user.status?handle=${user}&from=1&count=10`);
    return response.data.result as Submission[];
}

export function MultipleUser() {
    const [problems1, setProblems1] = useState<Submission[]>([]);
    const [problems2, setProblems2] = useState<Submission[]>([]);
    const user = localStorage.getItem("primaryUser");
    const suser = localStorage.getItem("secondaryUser");
    
    useEffect(() => {
        if(user) {
            getUser(user).then(setProblems1).catch((error) => {
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
        <div className="bg-red-700 h-screen p-4 text-white">
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

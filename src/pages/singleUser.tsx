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

export function SingleUser() {
    const [problems, setProblems] = useState<Submission[]>([]);
    const user = localStorage.getItem("primaryUser");

    useEffect(() => {
        if (user) {
            getUser(user).then(setProblems).catch((error) => {
                console.error("Error fetching user submissions:", error);
            });
        }
    }, [user]);

    if (!user) {
        return <div>Error fetching user</div>;
    }

    return (
        <div className="bg-red-700 h-screen p-4 text-white">
            <h1>User: {user}</h1>
            <h2 className="mt-4 font-bold">Recent Problems:</h2>
            <ul className="mt-2 list-disc list-inside">
                {problems.map((submission, index) => (
                    <li key={index}>{submission.problem.name}</li>
                ))}
            </ul>
        </div>
    );
}

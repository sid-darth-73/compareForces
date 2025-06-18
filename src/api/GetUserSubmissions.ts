export type Submission = {
    id: number;
    contestId: number;
    problem: {
        name: string;
        rating?: number;
        tags: string[];
    };
    programmingLanguage: string;
    verdict: string;
};

export async function GetUserSubmissions(user: string): Promise<Submission[]> {
    try {
        const res = await fetch(`https://codeforces.com/api/user.status?handle=${user}&from=1&count=10`);
        const data = await res.json();

        if (data.status !== "OK") return [];

        return data.result.map((submission: any) => ({
            id: submission.id,
            contestId: submission.contestId,
            problem: {
                name: submission.problem.name,
                rating: submission.problem.rating,
                tags: submission.problem.tags,
            },
            programmingLanguage: submission.programmingLanguage,
            verdict: submission.verdict,
        }));
    } catch (err) {
        console.error("Failed to fetch submissions:", err);
        return [];
    }
}

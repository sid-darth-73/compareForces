export function SubmissionApi(user: string) {
    return `https://codeforces.com/api/user.status?handle=${user}&from=1`
}
export function SubmissionApi(user: string) {
    return `http://localhost:8000/api/user/${user}/status?from=1`;
}
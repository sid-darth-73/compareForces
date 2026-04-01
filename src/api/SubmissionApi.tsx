import { API_BASE_URL } from "./config";
export function SubmissionApi(user: string) {
    return `${API_BASE_URL}/api/user/${user}/status?from=1`;
}
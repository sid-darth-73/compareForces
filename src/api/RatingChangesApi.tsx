import { API_BASE_URL } from "./config";
export function RatingChangesApi(handle: string) {
    return `${API_BASE_URL}/api/user/${handle}/rating`;
}
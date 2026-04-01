interface UserInfoApiI{
    handle1: string,
    handle2?: string
}
import { API_BASE_URL } from "./config";
export function UserInfoApi(props: UserInfoApiI) {
    return `${API_BASE_URL}/api/user/${props.handle1}/info`;
}
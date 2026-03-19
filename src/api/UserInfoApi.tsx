interface UserInfoApiI{
    handle1: string,
    handle2?: string
}

export function UserInfoApi(props: UserInfoApiI) {
    return `http://localhost:8000/api/user/${props.handle1}/info`;
}
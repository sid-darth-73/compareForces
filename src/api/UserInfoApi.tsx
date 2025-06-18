interface UserInfoApiI{
    handle1: string,
    handle2?: string
}

export function UserInfoApi(props: UserInfoApiI) {
    return `https://codeforces.com/api/user.info?handles=${props.handle1};${props.handle2}&checkHistoricHandles=false`
}
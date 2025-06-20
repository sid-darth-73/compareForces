type UserInfoProps = {
    avatar: string;
    rating: number;
    rank: string;
};

export function UserInfo({ avatar, rating, rank }: UserInfoProps) {
    return (
        <div className="flex items-center gap-4 mb-6 font-mont">
            <img
                src={avatar}
                alt="avatar"
                className="w-16 h-16 rounded-full border-2 border-white object-cover"
            />
            <div>
                <div className="text-lg font-semibold">Rating: {rating}</div>
                <div className="text-sm text-gray-300">Rank: {rank}</div>
            </div>
        </div>
    );
}

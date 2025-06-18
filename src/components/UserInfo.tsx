type UserInfoProps = {
    avatar: string;
    rating: number;
    rank: string;
};

export function UserInfo({ avatar, rating, rank }: UserInfoProps) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <img
                src={avatar}
                alt="avatar"
                className="w-16 h-16 rounded-full border-2 border-white object-cover"
            />
            <div>
                <div className="text-lg font-bold">Rating: {rating}</div>
                <div className="text-sm text-gray-300">Rank: {rank}</div>
            </div>
        </div>
    );
}

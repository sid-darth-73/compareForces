type UserInfoProps = {
    avatar: string;
    rating: number;
    rank: string;
};

export function UserInfo({ avatar, rating, rank }: UserInfoProps) {
    return (
        <div className="flex items-center gap-6 mb-8 p-6 glass-panel rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-sm opacity-70 animate-pulse"></div>
                <img
                    src={avatar}
                    alt="avatar"
                    className="relative w-24 h-24 rounded-full border-2 border-slate-800 object-cover z-10"
                />
            </div>
            
            <div className="space-y-1 z-10">
                <div className="text-3xl font-outfit font-bold">{rank}</div>
                <div className="text-lg font-quick text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Rating: <span className="text-white font-semibold">{rating}</span>
                </div>
            </div>
        </div>
    );
}

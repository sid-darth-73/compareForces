import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { Button } from "../components/ui/Button";
import { InfoCard } from "../components/InfoCard";
import { UserInfo } from "../components/UserInfo";
import { UserInfoApi } from "../api/UserInfoApi";

type UserData = {
    rating: number;
    maxRating: number;
    friendOfCount: number;
    rank: string;
    maxRank: string;
    avatar: string;
    contribution: number;
};

async function getUserInfo(user: string): Promise<UserData | null> {
    try {
        const response = await fetch(UserInfoApi({ handle1: user }));
        const data = await response.json();

        if(data.status !== "OK") return null;

        const result = data.result[0]; 

        return {
            rating: result.rating,
            maxRating: result.maxRating,
            friendOfCount: result.friendOfCount,
            rank: result.rank,
            maxRank: result.maxRank,
            avatar: result.titlePhoto || `https://avatars.dicebear.com/api/identicon/${user}.svg`,
            contribution: result.contribution,
        };
    } catch(err) {
        console.error("Failed to fetch user info:", err);
        return null;
    }
}


export function SingleUser() {
    const user = localStorage.getItem("primaryUser");
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<UserData | null>(null);

    useEffect(() => {
        if(user) {
            getUserInfo(user).then(setUserInfo);
        }
    }, [user]);

    if(!user) return <div className="text-white p-4">Error fetching user</div>;
    if(!userInfo) return <div className="text-white p-4">Loading user info...</div>;

    return (
        <div>
            <Navbar />
            <div className="bg-slate-800 min-h-screen p-4 text-white">
                <h1 className="text-2xl mb-4">User: {user}</h1>
                <UserInfo
                    avatar={userInfo.avatar}
                    rating={userInfo.rating}
                    rank={userInfo.rank}
                />

                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
                    <InfoCard text="Max Rating" value={userInfo.maxRating} />
                    <InfoCard text="Max Rank" value={userInfo.maxRank} />
                    <InfoCard text="Friend Count" value={userInfo.friendOfCount} />
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
                    <InfoCard text="Total Submissions" value={12} />
                    <InfoCard text="Contribution" value={userInfo.contribution} />
                    <InfoCard text="Total Problems" value={132} />
                    <InfoCard text="Current Rating" value={userInfo.rating} />
                </div>
                <div className="max-w-2xl mx-auto space-y-3">
                    <Button
                        size="md"
                        variant="primary"
                        text="Problem Distribution by Rating"
                        onClick={() => navigate("/problemdistributionsingle")}
                    />
                    <Button
                        size="md"
                        variant="secondary"
                        text="Rating Changes over Contests"
                        onClick={() => navigate("/ratingdistributionsingle")}
                    />
                </div>
            </div>
        </div>
    );
}

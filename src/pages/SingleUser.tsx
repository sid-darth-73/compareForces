import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar.tsx";
import { Button } from "../components/ui/Button.tsx";
import { InfoCard } from "../components/InfoCard.tsx";
import { UserInfo } from "../components/UserInfo.tsx";
import { UserInfoApi } from "../api/UserInfoApi.tsx";
import { GetUserSubmissions, type Submission } from "../api/GetUserSubmissions.ts";
import { Badge } from "../components/ui/Badge.tsx";

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

    if (data.status !== "OK") return null;

    const result = data.result[0];

    return {
      rating: result.rating,
      maxRating: result.maxRating,
      friendOfCount: result.friendOfCount,
      rank: result.rank,
      maxRank: result.maxRank,
      avatar:
        result.titlePhoto ||
        `https://avatars.dicebear.com/api/identicon/${user}.svg`,
      contribution: result.contribution,
    };
  } catch (err) {
    console.error("Failed to fetch user info:", err);
    return null;
  }
}

export function SingleUser() {
  const user = localStorage.getItem("primaryUser");
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true); // NEW loading state

  useEffect(() => {
    if (user) {
      Promise.all([
        getUserInfo(user).then(setUserInfo),
        GetUserSubmissions(user).then(setSubmissions),
      ]).finally(() => setIsLoading(false)); // Mark loading as done
    }
  }, [user]);

  if (!user) return <div className="text-white p-4">Error fetching user</div>;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xl font-mono">
        Fetching your Codeforces legacy...
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400 text-xl font-mono">
        Failed to load user data.
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="bg-slate-800 min-h-screen p-4 text-white">
        <UserInfo
          avatar={userInfo.avatar}
          rating={userInfo.rating}
          rank={userInfo.rank}
        />

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
          <InfoCard text="Max Rating" value={userInfo.maxRating} />
          <InfoCard text="Max Rank" value={userInfo.maxRank} />
          <InfoCard text="Friend Count" value={userInfo.friendOfCount} />
          <InfoCard text="Contribution" value={userInfo.contribution} />
        </div>

        <div className="max-w-2xl mx-auto space-y-3 space-x-2">
          <Button
            size="md"
            variant="primary"
            text="Problem Distribution by Rating"
            onClick={() => navigate("/problemdistributionsingle")}
          />
          <Button
            size="md"
            variant="primary"
            text="Rating Changes over Contests"
            onClick={() => navigate("/ratingdistributionsingle")}
          />
        </div>

        {submissions.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl mb-4 font-mont">Recent Submissions</h2>
            <ul className="space-y-2">
              {submissions.map((sub) => {
                let verdictVariant: "default" | "secondary" | "destructive" = "secondary";

                if (sub.verdict === "ACCEPTED") {
                  verdictVariant = "default";
                } else if (
                  [
                    "WRONG_ANSWER",
                    "TIME_LIMIT_EXCEEDED",
                    "COMPILATION_ERROR",
                    "RUNTIME_ERROR",
                  ].includes(sub.verdict)
                ) {
                  verdictVariant = "destructive";
                }

                return (
                  <li
                    key={sub.id}
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600 transition-all duration-200 hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 cursor-pointer font-mont"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold font-mont">{sub.problem.name}</div>
                      <Badge variant={verdictVariant}>{sub.verdict}</Badge>
                    </div>
                    <div className="text-sm text-gray-300 mt-1 font-quick">
                      Language: {sub.programmingLanguage}
                    </div>
                    {sub.problem.rating && (
                      <div className="text-sm text-gray-300 font-quick">
                        Rating: {sub.problem.rating}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

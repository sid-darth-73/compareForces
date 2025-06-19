import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { InfoCard } from "../components/InfoCard";
import { UserInfo } from "../components/UserInfo";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { UserInfoApi } from "../api/UserInfoApi";
import { GetUserSubmissions, type Submission } from "../api/GetUserSubmissions";

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

export function MultipleUser() {
  const user1 = localStorage.getItem("primaryUser");
  const user2 = localStorage.getItem("secondaryUser");
  const navigate = useNavigate();

  const [userInfo1, setUserInfo1] = useState<UserData | null>(null);
  const [userInfo2, setUserInfo2] = useState<UserData | null>(null);

  const [subs1, setSubs1] = useState<Submission[]>([]);
  const [subs2, setSubs2] = useState<Submission[]>([]);

  useEffect(() => {
    if (user1) {
      getUserInfo(user1).then(setUserInfo1);
      GetUserSubmissions(user1).then(setSubs1);
    }
    if (user2) {
      getUserInfo(user2).then(setUserInfo2);
      GetUserSubmissions(user2).then(setSubs2);
    }
  }, [user1, user2]);

  if (!user1 || !user2) return <div className="text-white p-4">Error fetching users</div>;
  if (!userInfo1 || !userInfo2) return <div className="text-white p-4">Loading users...</div>;

  return (
    <div>
      <Navbar />
      <div className="bg-slate-800 min-h-screen p-4 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Comparing: {user1} vs {user2}</h1>
          <div className="space-x-2">
            <Button
              size="sm"
              variant="primary"
              text="Problem Distribution"
              onClick={() => navigate("/problemdistributionmultiple")}
            />
            <Button
              size="sm"
              variant="primary"
              text="Rating Changes"
              onClick={() => navigate("/ratingdistributionmultiple")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* user 1 */}
          <div>
            <UserInfo
              avatar={userInfo1.avatar}
              rating={userInfo1.rating}
              rank={userInfo1.rank}
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InfoCard text="Max Rating" value={userInfo1.maxRating} />
              <InfoCard text="Max Rank" value={userInfo1.maxRank} />
              <InfoCard text="Friend Count" value={userInfo1.friendOfCount} />
              <InfoCard text="Contribution" value={userInfo1.contribution} />
            </div>
          </div>

          {/* user 2 */}
          <div>
            <UserInfo
              avatar={userInfo2.avatar}
              rating={userInfo2.rating}
              rank={userInfo2.rank}
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InfoCard text="Max Rating" value={userInfo2.maxRating} />
              <InfoCard text="Max Rank" value={userInfo2.maxRank} />
              <InfoCard text="Friend Count" value={userInfo2.friendOfCount} />
              <InfoCard text="Contribution" value={userInfo2.contribution} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* subs b user1 */}
          <div>
            <h2 className="text-xl mb-4">Recent Submissions: {user1}</h2>
            <ul className="space-y-2">
              {subs1.map((sub) => {
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
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600 transition-all duration-200 hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">{sub.problem.name}</div>
                      <Badge variant={verdictVariant}>{sub.verdict}</Badge>
                    </div>
                    <div className="text-sm text-gray-300 mt-1 font-mono">
                      Language: {sub.programmingLanguage}
                    </div>
                    {sub.problem.rating && (
                      <div className="text-sm text-gray-300 font-mono">
                        Rating: {sub.problem.rating}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* subs by user2 */}
          <div>
            <h2 className="text-xl mb-4">Recent Submissions: {user2}</h2>
            <ul className="space-y-2">
              {subs2.map((sub) => {
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
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600 transition-all duration-200 hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">{sub.problem.name}</div>
                      <Badge variant={verdictVariant}>{sub.verdict}</Badge>
                    </div>
                    <div className="text-sm text-gray-300 mt-1 font-mono">
                      Language: {sub.programmingLanguage}
                    </div>
                    {sub.problem.rating && (
                      <div className="text-sm text-gray-300 font-mono">
                        Rating: {sub.problem.rating}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

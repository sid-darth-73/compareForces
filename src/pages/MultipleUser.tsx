import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar.tsx";
import { InfoCard } from "../components/InfoCard.tsx";
import { UserInfo } from "../components/UserInfo.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Badge } from "../components/ui/Badge.tsx";
import { UserInfoApi } from "../api/UserInfoApi.tsx";
import { GetUserSubmissions, type Submission } from "../api/GetUserSubmissions.ts";
import { getComparisonResponse } from "../api/getComparisonResponse.ts";

import { info1 } from "../assets/SAMPLE_RESPONSE_INFO1.ts";
import { info2 } from "../assets/SAMPLE_RESPONSE_INFO2.ts";
import { sub1 } from "../assets/SAMPLE_RESPONSE_SUB1.ts";
import { sub2 } from "../assets/SAMPLE_RESPONSE_SUB2.ts";
import { type UserData } from "../types/UserData.ts";
import ReactMarkdown from "react-markdown";
function mapInfoResponse(data: any): UserData {
  const result = data.result[0];
  return {
    rating: result.rating,
    maxRating: result.maxRating,
    friendOfCount: result.friendOfCount,
    rank: result.rank,
    maxRank: result.maxRank,
    avatar:
      result.titlePhoto ||
      `https://avatars.dicebear.com/api/identicon/${result.handle}.svg`,
    contribution: result.contribution,
    lastOnlineTimeSeconds: result.lastOnlineTimeSeconds,
  };
}

async function getUserInfo(user: string): Promise<UserData | null> {
  // ✅ Use hardcoded fallback for unbit/Clash
  if (user === "unbit") return mapInfoResponse(info1);
  if (user === "Clash") return mapInfoResponse(info2);

  try {
    const response = await fetch(UserInfoApi({ handle1: user }));
    const data = await response.json();
    if (data.status !== "OK") return null;
    return mapInfoResponse(data);
  } catch (err) {
    console.error("Failed to fetch user info:", err);
    return null;
  }
}

async function getUserSubmissions(user: string): Promise<Submission[]> {
  // ✅ Use hardcoded fallback
  if (user === "unbit") return sub1.result;
  if (user === "Clash") return sub2.result;

  try {
    return await GetUserSubmissions(user);
  } catch (err) {
    console.error("Failed to fetch submissions:", err);
    return [];
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
  const [comparisonText, setComparisonText] = useState<string | null>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [showVerdict, setShowVerdict] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  if (user1 && user2) {
    Promise.all([
      getUserInfo(user1).then(setUserInfo1),
      getUserInfo(user2).then(setUserInfo2),
      getUserSubmissions(user1).then(setSubs1),
      getUserSubmissions(user2).then(setSubs2),
    ]).finally(() => setIsLoading(false));
  }
}, [user1, user2]);


  if (!user1 || !user2)
    return <div className="text-white p-4">Error fetching users</div>;

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xl font-mono">
        Comparing profiles, please wait...
      </div>
    );

  if (!userInfo1 || !userInfo2)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400 text-xl font-mono">
        Failed to load user data.
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="bg-slate-800 min-h-screen p-4 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-mont">Comparing: {user1} vs {user2}</h1>
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
            <Button
              size="sm"
              variant="secondary"
              text={
                loadingComparison
                  ? "Loading..."
                  : comparisonText && showVerdict
                  ? "Close Verdict"
                  : "Who is better?"
              }
              onClick={async () => {
                if (comparisonText && showVerdict) {
                  setShowVerdict(false);
                  return;
                }
                if (comparisonText) {
                  setShowVerdict(true);
                  return;
                }

                setLoadingComparison(true);
                try {
                  const result = await getComparisonResponse({
                    user1,
                    user2,
                    userInfo1,
                    userInfo2,
                  });
                  setComparisonText(result);
                  setShowVerdict(true);
                } catch (err) {
                  setComparisonText("Oops! Something went wrong generating the comparison.");
                  setShowVerdict(true);
                } finally {
                  setLoadingComparison(false);
                }
              }}
            />
          </div>

          {comparisonText && showVerdict && (
            <div className="mt-8 p-6 bg-slate-700 border border-slate-600 rounded-lg text-white whitespace-pre-line">
              <h2 className="text-xl font-semibold mb-4">🤖 AI Verdict:</h2>
              <div className="font-mont">
                <ReactMarkdown>{comparisonText}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* user info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <UserInfo avatar={userInfo1.avatar} rating={userInfo1.rating} rank={userInfo1.rank} />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InfoCard text="Max Rating" value={userInfo1.maxRating} />
              <InfoCard text="Max Rank" value={userInfo1.maxRank} />
              <InfoCard text="Friend Count" value={userInfo1.friendOfCount} />
              <InfoCard text="Contribution" value={userInfo1.contribution} />
            </div>
          </div>

          <div>
            <UserInfo avatar={userInfo2.avatar} rating={userInfo2.rating} rank={userInfo2.rank} />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InfoCard text="Max Rating" value={userInfo2.maxRating} />
              <InfoCard text="Max Rank" value={userInfo2.maxRank} />
              <InfoCard text="Friend Count" value={userInfo2.friendOfCount} />
              <InfoCard text="Contribution" value={userInfo2.contribution} />
            </div>
          </div>
        </div>

        {/* submissions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl mb-4 font-mont">Recent Submissions: {user1}</h2>
            <ul className="space-y-2">
              {subs1.map((sub) => {
                let verdictVariant: "default" | "secondary" | "destructive" = "secondary";
                if (sub.verdict === "ACCEPTED" || sub.verdict==="OK") {
                  verdictVariant="default"; sub.verdict="ACCEPTED"
                }
                else if (
                  ["WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "COMPILATION_ERROR", "RUNTIME_ERROR"].includes(sub.verdict)
                )
                  verdictVariant = "destructive";

                return (
                  <li
                    key={sub.id}
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600 transition-all duration-200 hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold font-mont">{sub.problem.name}</div>
                      <Badge variant={verdictVariant}>{sub.verdict}</Badge>
                    </div>
                    <div className="text-sm text-gray-300 mt-1 font-quick">
                      Language: {sub.programmingLanguage}
                    </div>
                    {sub.problem.rating && (
                      <div className="text-sm text-gray-300 font-quick">Rating: {sub.problem.rating}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="text-xl mb-4 font-mont">Recent Submissions: {user2}</h2>
            <ul className="space-y-2">
              {subs2.map((sub) => {
                let verdictVariant: "default" | "secondary" | "destructive" = "secondary";
                if (sub.verdict === "ACCEPTED" || sub.verdict==="OK") {
                  verdictVariant="default"; sub.verdict="ACCEPTED"
                }
                else if (
                  ["WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "COMPILATION_ERROR", "RUNTIME_ERROR"].includes(sub.verdict)
                )
                  verdictVariant = "destructive";

                return (
                  <li
                    key={sub.id}
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600 transition-all duration-200 hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold font-mont">{sub.problem.name}</div>
                      <Badge variant={verdictVariant}>{sub.verdict}</Badge>
                    </div>
                    <div className="text-sm text-gray-300 mt-1 font-quick">
                      Language: {sub.programmingLanguage}
                    </div>
                    {sub.problem.rating && (
                      <div className="text-sm text-gray-300 font-quick">Rating: {sub.problem.rating}</div>
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

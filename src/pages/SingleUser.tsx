import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar.tsx";
import { Button } from "../components/ui/Button.tsx";
import { InfoCard } from "../components/InfoCard.tsx";
import { UserInfo } from "../components/UserInfo.tsx";
import { UserInfoApi } from "../api/UserInfoApi.tsx";
import { GetUserSubmissions, type Submission } from "../api/GetUserSubmissions.ts";
import { Badge } from "../components/ui/Badge.tsx";
import { BrainCircuit, Target, Code2, AlertTriangle, TrendingUp } from "lucide-react";
import { API_BASE_URL } from "../api/config.ts";
type UserData = {
  rating: number;
  maxRating: number;
  friendOfCount: number;
  rank: string;
  maxRank: string;
  avatar: string;
  contribution: number;
};

type RecommendationData = {
  upsolve_problems: any[];
  tag_recommendations: [string, number][];
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
  } catch (err) {
    console.error("Failed to fetch user info:", err);
    return null;
  }
}

async function getRecommendations(user: string): Promise<RecommendationData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/${user}/recommendations`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch recommendations:", err);
    return null;
  }
}

export function SingleUser() {
  const user = localStorage.getItem("primaryUser");
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    if (user) {
      Promise.all([
        getUserInfo(user).then(setUserInfo),
        GetUserSubmissions(user).then(setSubmissions),
        getRecommendations(user).then(setRecommendations)
      ]).finally(() => setIsLoading(false));
    }
  }, [user]);

  if (!user) return <div className="text-white p-4">Error fetching user</div>;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <BrainCircuit className="w-12 h-12 text-purple-400 animate-pulse" />
        <div className="font-outfit text-xl tracking-wide">Fetching your Codeforces legacy...</div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400 text-xl font-outfit">
        Failed to load user data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
        
        {/* Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <UserInfo avatar={userInfo.avatar} rating={userInfo.rating} rank={userInfo.rank} />
            <div className="space-y-3 mt-4">
              <Button size="lg" variant="primary" text="Problem Distribution" fullWidth onClick={() => navigate("/problemdistributionsingle")} />
              <Button size="lg" variant="secondary" text="Rating Changes" fullWidth onClick={() => navigate("/ratingdistributionsingle")} />
            </div>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-2 gap-4 h-max">
            <InfoCard text="Max Rating" value={userInfo.maxRating} />
            <InfoCard text="Max Rank" value={userInfo.maxRank} />
            <InfoCard text="Friend Count" value={userInfo.friendOfCount} />
            <InfoCard text="Contribution" value={userInfo.contribution} />
          </div>
        </div>

        {/* Recommendations Engine */}
        {recommendations && (
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <BrainCircuit className="w-64 h-64 text-purple-500" />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-outfit font-bold text-white">AI Training Plan</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {/* Weak Topics */}
              <div className="space-y-4">
                <h3 className="text-lg font-quick text-slate-300 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" /> Topic Weaknesses
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations.tag_recommendations.slice(0, 8).map(([tag, count], idx) => (
                    <div key={idx} className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200">{tag}</span>
                      <span className="text-xs text-slate-500 bg-slate-900 px-1.5 rounded">{count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-400 mt-2 font-quick">
                  You haven't solved many problems in these categories. Focusing here will yield the highest ELO gain.
                </p>
              </div>

              {/* Upsolving Targets */}
              <div className="space-y-4">
                <h3 className="text-lg font-quick text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" /> Suggested Upsolves
                </h3>
                <div className="space-y-3">
                  {recommendations.upsolve_problems.slice(0, 5).map((prob, idx) => (
                    <a 
                      key={idx} 
                      href={`https://codeforces.com/problemset/problem/${prob.contestId}/${prob.index}`} 
                      target="_blank" rel="noreferrer"
                      className="block bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl p-3 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-purple-300">{prob.contestId}{prob.index}</span>
                        {prob.rating && <Badge variant="outline">{prob.rating}</Badge>}
                      </div>
                      <div className="text-sm font-medium truncate">{prob.name}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Submissions */}
        {submissions.length > 0 && (
          <div className="glass-panel rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-outfit font-bold text-white">Recent Submissions</h2>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-slate-700/50">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 font-quick text-slate-400 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Problem</th>
                    <th className="px-6 py-4 font-medium">Verdict</th>
                    <th className="px-6 py-4 font-medium text-right">Language</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 bg-slate-900/50 font-quick">
                  {submissions.map((sub) => {
                    let verdictVariant: "default" | "secondary" | "destructive" = "secondary";
                    if (sub.verdict === "ACCEPTED") verdictVariant = "default";
                    else if (["WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "COMPILATION_ERROR", "RUNTIME_ERROR"].includes(sub.verdict)) {
                      verdictVariant = "destructive";
                    }

                    return (
                      <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-200">
                          {sub.problem.name}
                          {sub.problem.rating && <span className="ml-2 text-xs text-slate-500">({sub.problem.rating})</span>}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={verdictVariant}>{sub.verdict}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-400">
                          {sub.programmingLanguage}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

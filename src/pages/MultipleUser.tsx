import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

// Components
import { Navbar } from "../components/ui/Navbar.tsx";
import { InfoCard } from "../components/InfoCard.tsx";
import { UserInfo } from "../components/UserInfo.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Badge } from "../components/ui/Badge.tsx";
import { Swords, Code2, Cpu } from "lucide-react";

// APIs
import { UserInfoApi } from "../api/UserInfoApi.tsx";
import { GetUserSubmissions, type Submission } from "../api/GetUserSubmissions.ts";
import { streamComparisonResponse } from "../api/getComparisonResponse.ts";
import { Target, AlertTriangle, TrendingUp, BrainCircuit } from "lucide-react";
import { API_BASE_URL } from "../api/config.ts";
type RecommendationData = {
  upsolve_problems: any[];
  tag_recommendations: [string, number][];
};

type UserData = {
  rating: number;
  maxRating: number;
  friendOfCount: number;
  rank: string;
  maxRank: string;
  avatar: string;
  contribution: number;
  lastOnlineTimeSeconds: number;
};

function mapInfoResponse(data: any): UserData {
  const result = data.result[0];
  return {
    rating: result.rating,
    maxRating: result.maxRating,
    friendOfCount: result.friendOfCount,
    rank: result.rank,
    maxRank: result.maxRank,
    avatar: result.titlePhoto || `https://avatars.dicebear.com/api/identicon/${result.handle}.svg`,
    contribution: result.contribution,
    lastOnlineTimeSeconds: result.lastOnlineTimeSeconds,
  };
}

async function getUserInfo(user: string): Promise<UserData | null> {
  try {
    const response = await fetch(UserInfoApi({ handle1: user }));
    const data = await response.json();
    if (data.status !== "OK") return null;
    return mapInfoResponse(data);
  } catch (err) {
    return null;
  }
}

async function getUserSubmissions(user: string): Promise<Submission[]> {
  try {
    return await GetUserSubmissions(user);
  } catch (err) {
    return [];
  }
}

async function getRecommendations(user: string): Promise<RecommendationData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/${user}/recommendations`);
    const data = await response.json();
    if (data.detail) return null; // handle error responses
    return data;
  } catch (err) {
    return null;
  }
}

export function MultipleUser() {
  const user1_handle = localStorage.getItem("primaryUser");
  const user2_handle = localStorage.getItem("secondaryUser");
  const navigate = useNavigate();

  const [userInfo1, setUserInfo1] = useState<UserData | null>(null);
  const [userInfo2, setUserInfo2] = useState<UserData | null>(null);
  const [subs1, setSubs1] = useState<Submission[]>([]);
  const [subs2, setSubs2] = useState<Submission[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Streaming & Comparison State
  const [comparisonText, setComparisonText] = useState<string | null>(null);
  const [showVerdict, setShowVerdict] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Real-time updates
  const [currentStep, setCurrentStep] = useState<string>("");
  const [currentThought, setCurrentThought] = useState<string>("");
  const [scores, setScores] = useState({ user1: 0, user2: 0 });

  useEffect(() => {
    if (user1_handle && user2_handle) {
      Promise.all([
        getUserInfo(user1_handle).then(setUserInfo1),
        getUserInfo(user2_handle).then(setUserInfo2),
        getUserSubmissions(user1_handle).then(setSubs1),
        getUserSubmissions(user2_handle).then(setSubs2),
        getRecommendations(user1_handle).then(setRecommendations),
      ]).finally(() => setIsLoading(false));
    }
  }, [user1_handle, user2_handle]);

  const extractContent = (msg: any) => {
    if (typeof msg === "string") return msg;
    return msg?.content || "";
  };

  const handleRunComparison = async () => {
    if (comparisonText && showVerdict) {
      setShowVerdict(false);
      return;
    }
    if (comparisonText) {
      setShowVerdict(true);
      return;
    }

    setIsStreaming(true);
    setShowVerdict(true);
    setComparisonText("");
    setScores({ user1: 0, user2: 0 });
    setCurrentThought("");

    await streamComparisonResponse({
      user1_handle: user1_handle!,
      user2_handle: user2_handle!,
      onUpdate: (data) => {
        setCurrentStep(data.node);
        setCurrentThought(extractContent(data.message));
        setScores(data.current_scores);
      },
      onComplete: (data) => {
        setIsStreaming(false);
        const fullLog = data.verdict_log
          .map((m: any) => extractContent(m))
          .join("\n\n");
          
        setComparisonText(fullLog);
        setScores({ user1: data.user1_score, user2: data.user2_score });
      },
      onError: (err) => {
        setIsStreaming(false);
        setComparisonText(`**Error:** ${err}`);
      },
    });
  };

  if (!user1_handle || !user2_handle)
    return <div className="text-white p-4">Error fetching users</div>;

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <Swords className="w-12 h-12 text-purple-400 animate-pulse" />
        <div className="font-outfit text-xl tracking-wide">Preparing the Arena...</div>
      </div>
    );

  if (!userInfo1 || !userInfo2)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400 text-xl font-outfit">
        Failed to load one or both users.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 glass-panel p-6 rounded-3xl">
          <h1 className="text-3xl font-outfit font-bold flex items-center gap-3">
            <span className="text-purple-400 truncate max-w-[150px] md:max-w-xs">{user1_handle}</span>
            <span className="text-slate-500 font-light text-xl italic">VS</span>
            <span className="text-blue-400 truncate max-w-[150px] md:max-w-xs">{user2_handle}</span>
          </h1>
          <div className="flex flex-wrap gap-3">
            <Button
              size="sm"
              variant="secondary"
              text="Problems"
              onClick={() => navigate("/problemdistributionmultiple")}
            />
            <Button
              size="sm"
              variant="secondary"
              text="Ratings"
              onClick={() => navigate("/ratingdistributionmultiple")}
            />
            <Button
              size="sm"
              variant="primary"
              startIcon={Swords}
              text={
                isStreaming
                  ? "Analyzing Contestants..."
                  : comparisonText && showVerdict
                  ? "Hide Verdict"
                  : "Begin Battle AI"
              }
              onClick={handleRunComparison}
              loading={isStreaming}
            />
          </div>
        </div>

        {/* --- AI Verdict / Streaming Section --- */}
        {showVerdict && (
          <div className="relative glass-panel rounded-3xl p-8 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] overflow-hidden transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 mb-10 mt-4">
              <div className="text-center w-full md:w-48 bg-slate-900/40 p-6 rounded-3xl border border-slate-700/50 shadow-inner">
                <div className="font-outfit font-bold text-xl text-purple-400 truncate">{user1_handle}</div>
                <div className="text-5xl font-mono font-bold mt-2 text-white drop-shadow-lg">{scores.user1.toFixed(1)}</div>
              </div>
              
              <div className="flex flex-col items-center py-4">
                <div className="text-xs font-quick font-bold text-slate-400 tracking-[0.2em] mb-3">LIVE SCORE</div>
                <div className="p-4 bg-slate-800/80 rounded-full shadow-lg border border-slate-700">
                  <Swords className="w-8 h-8 text-slate-400" />
                </div>
              </div>
              
              <div className="text-center w-full md:w-48 bg-slate-900/40 p-6 rounded-3xl border border-slate-700/50 shadow-inner">
                <div className="font-outfit font-bold text-xl text-blue-400 truncate">{user2_handle}</div>
                <div className="text-5xl font-mono font-bold mt-2 text-white drop-shadow-lg">{scores.user2.toFixed(1)}</div>
              </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              {isStreaming ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-purple-300 font-quick text-sm uppercase tracking-wider mb-4 border-b border-purple-500/20 pb-4">
                    <Cpu className="w-5 h-5 animate-pulse text-purple-400" />
                    <span className="font-bold">Processing Node:</span>
                    <span className="bg-purple-500/20 px-3 py-1 rounded-md text-purple-200">
                      {currentStep.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-700/50 min-h-[160px] max-h-[300px] overflow-y-auto shadow-inner">
                    {currentThought ? (
                      <div className="prose prose-invert prose-purple max-w-none font-outfit text-lg">
                        <ReactMarkdown>{currentThought}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full opacity-50 font-quick italic text-slate-400 py-10">
                        Gathering intelligence across platforms...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/60 rounded-3xl border border-purple-500/20 p-8 shadow-2xl">
                  <h2 className="text-2xl font-outfit font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 flex items-center gap-3 border-b border-slate-700/50 pb-4">
                    <Cpu className="w-6 h-6 text-purple-400" /> Executive Summary
                  </h2>
                  <div className="font-quick text-slate-200 prose prose-invert prose-purple max-w-none prose-headings:font-outfit prose-headings:text-purple-300 prose-a:text-blue-400 prose-strong:text-purple-300 text-lg leading-relaxed">
                    <ReactMarkdown>{comparisonText || ""}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- User Info Cards --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="space-y-6 relative glass-panel p-6 rounded-3xl border border-purple-500/10 shadow-lg">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none rounded-3xl" />
            <UserInfo avatar={userInfo1.avatar} rating={userInfo1.rating} rank={userInfo1.rank} />
            <div className="grid grid-cols-2 gap-4">
              <InfoCard text="Max Rating" value={userInfo1.maxRating} />
              <InfoCard text="Max Rank" value={userInfo1.maxRank} />
              <InfoCard text="Friends" value={userInfo1.friendOfCount} />
              <InfoCard text="Contrib" value={userInfo1.contribution} />
            </div>
          </div>

          <div className="space-y-6 relative glass-panel p-6 rounded-3xl border border-blue-500/10 shadow-lg">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none rounded-3xl" />
            <UserInfo avatar={userInfo2.avatar} rating={userInfo2.rating} rank={userInfo2.rank} />
            <div className="grid grid-cols-2 gap-4">
              <InfoCard text="Max Rating" value={userInfo2.maxRating} />
              <InfoCard text="Max Rank" value={userInfo2.maxRank} />
              <InfoCard text="Friends" value={userInfo2.friendOfCount} />
              <InfoCard text="Contrib" value={userInfo2.contribution} />
            </div>
          </div>
        </div>

        {/* --- Primary User AI Training Plan --- */}
        {recommendations && (
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)] mb-10">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <BrainCircuit className="w-64 h-64 text-purple-500" />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-outfit font-bold text-white">
                {user1_handle}'s AI Training Plan
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {/* Weak Topics */}
              <div className="space-y-4">
                <h3 className="text-lg font-quick text-slate-300 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" /> Topic Weaknesses
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations.tag_recommendations?.slice(0, 8).map(([tag, count], idx) => (
                    <div key={idx} className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200">{tag}</span>
                      <span className="text-xs text-slate-500 bg-slate-900 px-1.5 rounded">{count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-400 mt-2 font-quick">
                  You haven't solved many problems in these categories. Focusing here will yield the highest ELO gain against {user2_handle}.
                </p>
              </div>

              {/* Upsolving Targets */}
              <div className="space-y-4">
                <h3 className="text-lg font-quick text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" /> Suggested Upsolves
                </h3>
                <div className="space-y-3">
                  {recommendations.upsolve_problems?.slice(0, 5).map((prob, idx) => (
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

        {/* --- Submissions --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { handle: user1_handle, subs: subs1, color: "text-purple-400", border: "border-purple-500/20" },
            { handle: user2_handle, subs: subs2, color: "text-blue-400", border: "border-blue-500/20" }
          ].map((user, idx) => (
            <div key={idx} className={`glass-panel p-6 rounded-3xl border ${user.border}`}>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
                <Code2 className={`w-6 h-6 flex-shrink-0 ${user.color}`} />
                <h2 className="text-2xl font-outfit font-bold truncate">Recent by <span className={user.color}>{user.handle}</span></h2>
              </div>
              
              <ul className="space-y-3">
                {user.subs.map((sub) => {
                  let verdictVariant: "default" | "secondary" | "destructive" = "secondary";
                  if (sub.verdict === "ACCEPTED" || sub.verdict === "OK") {
                    verdictVariant = "default";
                    sub.verdict = "ACCEPTED";
                  } else if (["WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "COMPILATION_ERROR", "RUNTIME_ERROR"].includes(sub.verdict)) {
                    verdictVariant = "destructive";
                  }

                  return (
                    <li
                      key={sub.id}
                      className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 transition-all duration-300 hover:bg-slate-700/60 hover:-translate-y-1 hover:shadow-lg cursor-pointer group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="font-semibold font-quick text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                          {sub.problem.name}
                        </div>
                        <Badge variant={verdictVariant} className="flex-shrink-0">{sub.verdict}</Badge>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700/50">
                        <div className="text-xs text-slate-400 font-mono bg-slate-900/80 px-2 py-1 rounded-md border border-slate-700/50">
                          {sub.programmingLanguage}
                        </div>
                        {sub.problem.rating && (
                          <div className="text-xs text-slate-300 font-quick font-bold bg-slate-800 px-2 py-1 rounded-md">
                            Rating: {sub.problem.rating}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
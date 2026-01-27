import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

// Components
import { Navbar } from "../components/ui/Navbar.tsx";
import { InfoCard } from "../components/InfoCard.tsx";
import { UserInfo } from "../components/UserInfo.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Badge } from "../components/ui/Badge.tsx";

// APIs
import { UserInfoApi } from "../api/UserInfoApi.tsx";
import { GetUserSubmissions, type Submission } from "../api/GetUserSubmissions.ts";
import { streamComparisonResponse } from "../api/getComparisonResponse.ts"; // Ensure this matches your filename

// Types (Notice the 'type' keyword here to fix your error)
import type { UserData } from "../types/UserData.ts";

// Sample Data
import { info1 } from "../assets/SAMPLE_RESPONSE_INFO1.ts";
import { info2 } from "../assets/SAMPLE_RESPONSE_INFO2.ts";
import { sub1 } from "../assets/SAMPLE_RESPONSE_SUB1.ts";
import { sub2 } from "../assets/SAMPLE_RESPONSE_SUB2.ts";

// --- Helper Functions ---

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

// --- Main Component ---

export function MultipleUser() {
  const user1_handle = localStorage.getItem("primaryUser");
  const user2_handle = localStorage.getItem("secondaryUser");
  const navigate = useNavigate();

  // User Data State
  const [userInfo1, setUserInfo1] = useState<UserData | null>(null);
  const [userInfo2, setUserInfo2] = useState<UserData | null>(null);
  const [subs1, setSubs1] = useState<Submission[]>([]);
  const [subs2, setSubs2] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Streaming & Comparison State
  const [comparisonText, setComparisonText] = useState<string | null>(null);
  const [showVerdict, setShowVerdict] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Real-time updates
  const [currentStep, setCurrentStep] = useState<string>("");
  const [currentThought, setCurrentThought] = useState<string>("");
  const [scores, setScores] = useState({ user1: 0, user2: 0 });

  // Initial Data Load
  useEffect(() => {
    if (user1_handle && user2_handle) {
      Promise.all([
        getUserInfo(user1_handle).then(setUserInfo1),
        getUserInfo(user2_handle).then(setUserInfo2),
        getUserSubmissions(user1_handle).then(setSubs1),
        getUserSubmissions(user2_handle).then(setSubs2),
      ]).finally(() => setIsLoading(false));
    }
  }, [user1_handle, user2_handle]);

  // Helper to extract string content from LangChain message objects
  const extractContent = (msg: any) => {
    if (typeof msg === "string") return msg;
    // Handle LangChain message object structure
    return msg?.content || "";
  };

  // Handler for Streaming
  const handleRunComparison = async () => {
    // 1. Toggle visibility if result exists
    if (comparisonText && showVerdict) {
      setShowVerdict(false);
      return;
    }
    if (comparisonText) {
      setShowVerdict(true);
      return;
    }

    // 2. Start New Stream
    setIsStreaming(true);
    setShowVerdict(true);
    setComparisonText(""); // Clear previous text
    setScores({ user1: 0, user2: 0 }); // Reset scores
    setCurrentThought("");

    await streamComparisonResponse({
      user1_handle: user1_handle!,
      user2_handle: user2_handle!,
      onUpdate: (data) => {
        // Update UI with the node currently running and its partial output
        setCurrentStep(data.node);
        setCurrentThought(extractContent(data.message));
        setScores(data.current_scores);
      },
      onComplete: (data) => {
        setIsStreaming(false);
        // Combine the log into one markdown string or just use the final summary message
        // Here we join the full log for a detailed verdict
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

  // --- Render Guards ---

  if (!user1_handle || !user2_handle)
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

  // --- Main JSX ---

  return (
    <div>
      <Navbar />
      <div className="bg-slate-800 min-h-screen p-4 text-white">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-mont">Comparing: {user1_handle} vs {user2_handle}</h1>
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
                isStreaming
                  ? "Analyzing..."
                  : comparisonText && showVerdict
                  ? "Close Verdict"
                  : "Who is better?"
              }
              onClick={handleRunComparison}
              loading={isStreaming}
            />
          </div>
        </div>

        {/* --- AI Verdict / Streaming Section --- */}
        {showVerdict && (
          <div className="mb-10 p-6 bg-slate-700 border border-slate-600 rounded-lg text-white">
            
            {/* Live Scoreboard */}
            <div className="flex items-center justify-between mb-6 bg-slate-800 p-4 rounded-md border border-slate-600">
              <div className="text-center w-1/3">
                <div className="font-bold text-xl text-blue-400">{user1_handle}</div>
                <div className="text-3xl font-mono">{scores.user1.toFixed(1)}</div>
              </div>
              
              <div className="text-center text-gray-500 font-mont text-sm tracking-widest">
                VS SCORE
              </div>
              
              <div className="text-center w-1/3">
                <div className="font-bold text-xl text-green-400">{user2_handle}</div>
                <div className="text-3xl font-mono">{scores.user2.toFixed(1)}</div>
              </div>
            </div>

            {/* Streaming Content */}
            {isStreaming ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-yellow-400 font-mono text-sm uppercase tracking-wide">
                  <span className="animate-spin">⚙️</span>
                  <span>Processing: {currentStep.replace("_", " ")}</span>
                </div>
                {/* Current Thought Stream */}
                <div className="p-4 bg-slate-800 rounded border-l-4 border-yellow-500 font-mono text-sm text-gray-300 min-h-[120px] max-h-[300px] overflow-y-auto">
                  {currentThought ? (
                     <ReactMarkdown>{currentThought}</ReactMarkdown>
                  ) : (
                    <span className="italic opacity-50">Waiting for model output...</span>
                  )}
                </div>
              </div>
            ) : (
              /* Final Verdict */
              <div>
                <h2 className="text-xl font-semibold mb-4 text-purple-300">🤖 AI Verdict Log:</h2>
                <div className="font-mont text-gray-200 prose prose-invert max-w-none">
                  <ReactMarkdown>{comparisonText || ""}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- User Info Cards --- */}
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

        {/* --- Submissions --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User 1 Submissions */}
          <div>
            <h2 className="text-xl mb-4 font-mont">Recent Submissions: {user1_handle}</h2>
            <ul className="space-y-2">
              {subs1.map((sub) => {
                let verdictVariant: "default" | "secondary" | "destructive" = "secondary";
                if (sub.verdict === "ACCEPTED" || sub.verdict === "OK") {
                  verdictVariant = "default";
                  sub.verdict = "ACCEPTED";
                } else if (
                  ["WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "COMPILATION_ERROR", "RUNTIME_ERROR"].includes(sub.verdict)
                ) {
                  verdictVariant = "destructive";
                }

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

          {/* User 2 Submissions */}
          <div>
            <h2 className="text-xl mb-4 font-mont">Recent Submissions: {user2_handle}</h2>
            <ul className="space-y-2">
              {subs2.map((sub) => {
                let verdictVariant: "default" | "secondary" | "destructive" = "secondary";
                if (sub.verdict === "ACCEPTED" || sub.verdict === "OK") {
                  verdictVariant = "default";
                  sub.verdict = "ACCEPTED";
                } else if (
                  ["WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "COMPILATION_ERROR", "RUNTIME_ERROR"].includes(sub.verdict)
                ) {
                  verdictVariant = "destructive";
                }

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
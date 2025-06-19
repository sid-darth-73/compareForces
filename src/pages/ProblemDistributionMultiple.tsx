import { useEffect, useState } from 'react';
import { SubmissionApi } from '../api/SubmissionApi';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/ui/Navbar';

interface Problem {
  name: string;
  contestId: number;
  index: string;
  url: string;
}

interface UserData {
  ratingMap: Record<number, Problem[]>;
  ratingCount: Record<number, number>;
  problemSet: Set<string>;
}

async function getSolvedProblemsByRating(handle: string): Promise<UserData> {
  const res = await fetch(SubmissionApi(handle));
  const data = await res.json();

  if (data.status !== 'OK') throw new Error("Failed to fetch data");

  const submissions = data.result;
  const solvedSet = new Set<string>();
  const ratingMap: Record<number, Problem[]> = {};
  const ratingCount: Record<number, number> = {};

  for (const sub of submissions) {
    if (sub.verdict !== 'OK') continue;

    const key = `${sub.problem.contestId}-${sub.problem.index}`;
    if (solvedSet.has(key)) continue;
    solvedSet.add(key);

    const rating = sub.problem.rating ?? 0;
    if (!ratingMap[rating]) ratingMap[rating] = [];
    if (!ratingCount[rating]) ratingCount[rating] = 0;

    ratingMap[rating].push({
      name: sub.problem.name,
      contestId: sub.problem.contestId,
      index: sub.problem.index,
      url: `https://codeforces.com/contest/${sub.problem.contestId}/problem/${sub.problem.index}`,
    });

    ratingCount[rating]++;
  }

  return {
    ratingMap,
    ratingCount,
    problemSet: solvedSet,
  };
}

export function ProblemDistributionMultiple() {
  const [user1Data, setUser1Data] = useState<UserData | null>(null);
  const [user2Data, setUser2Data] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedRatings, setExpandedRatings] = useState<Set<number>>(new Set());
  const [name1, setName1] = useState<string | null>(null)
  const [name2, setName2] = useState<string | null>(null)
  useEffect(() => {
    const user1 = localStorage.getItem('primaryUser');
    const user2 = localStorage.getItem('secondaryUser');
    setName1(user1)
    setName2(user2)
    if (!user1 || !user2) {
      setError("Both users must be present in localStorage");
      return;
    }

    Promise.all([
      getSolvedProblemsByRating(user1),
      getSolvedProblemsByRating(user2),
    ])
      .then(([data1, data2]) => {
        setUser1Data(data1);
        setUser2Data(data2);
      })
      .catch((err) => setError(err.message));
  }, []);

  const toggleRating = (rating: number) => {
    setExpandedRatings((prev) => {
      const newSet = new Set(prev);
      newSet.has(rating) ? newSet.delete(rating) : newSet.add(rating);
      return newSet;
    });
  };

  if (error) return <div className="p-4 text-red-400 bg-slate-800 min-h-screen">{error}</div>;
  if (!user1Data || !user2Data) return <div className="p-4 text-white bg-slate-800 min-h-screen">Loading...</div>;

  const allRatings = Array.from(
    new Set([
      ...Object.keys(user1Data.ratingMap).map(Number),
      ...Object.keys(user2Data.ratingMap).map(Number),
    ])
  ).sort((a, b) => a - b);

  const isCommon = (problem: Problem, otherSet: Set<string>) =>
    otherSet.has(`${problem.contestId}-${problem.index}`);

  return (
    <div>
      <Navbar />
      <div className="bg-slate-800 min-h-screen p-4 text-white">
        <h1 className="text-2xl mb-6">Compare Solved Problems by Rating</h1>
        <div className="space-y-6">
          {allRatings.map((rating) => (
            <div
              key={rating}
              className="p-4 rounded-lg bg-slate-700 border border-slate-600 transition-all duration-200 hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">
                  Rating: {rating==0 ? "Unrated": rating}
                </h2>
                <Button
                  variant="primary"
                  size="sm"
                  text={expandedRatings.has(rating) ? 'Hide problems' : 'Show problems'}
                  onClick={() => toggleRating(rating)}
                />
              </div>
              <div className="text-gray-300 font-mono mb-3">
                {name1}: {user1Data.ratingCount[rating] || 0} {user1Data.ratingCount[rating]>1 ? "problems": "problem"} | {name2}: {user2Data.ratingCount[rating] || 0} {user2Data.ratingCount[rating]>1 ? "problems": "problem"}
              </div>
              {expandedRatings.has(rating) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {/* user1 */}
                  <div>
                    <h3 className="font-semibold mb-2">User 1</h3>
                    <ul className="space-y-1">
                      {(user1Data.ratingMap[rating] || []).map((problem, idx) => {
                        const common = isCommon(problem, user2Data.problemSet);
                        return (
                          <li key={idx}>
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`hover:underline ${common ? 'text-green-400 font-bold' : 'text-blue-400'}`}
                            >
                              {problem.name} ({problem.index}) {common && '⭐'}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* user2 */}
                  <div>
                    <h3 className="font-semibold mb-2">User 2</h3>
                    <ul className="space-y-1">
                      {(user2Data.ratingMap[rating] || []).map((problem, idx) => {
                        const common = isCommon(problem, user1Data.problemSet);
                        return (
                          <li key={idx}>
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`hover:underline ${common ? 'text-green-400 font-bold' : 'text-blue-400'}`}
                            >
                              {problem.name} ({problem.index}) {common && '⭐'}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

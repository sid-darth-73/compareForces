import { useEffect, useState } from 'react';
import { SubmissionApi } from '../api/SubmissionApi';
import { Button } from '../components/ui/Button';

interface Problem {
  name: string;
  contestId: number;
  index: string;
  url: string;
}

interface UserData {
  ratingMap: Record<number, Problem[]>;
  ratingCount: Record<number, number>;
  problemSet: Set<string>; // for quick lookup of solved problems
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

export function MultipleUser() {
  const [user1Data, setUser1Data] = useState<UserData | null>(null);
  const [user2Data, setUser2Data] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedRatings, setExpandedRatings] = useState<Set<number>>(new Set());

  useEffect(() => {
    const user1 = localStorage.getItem('primaryUser');
    const user2 = localStorage.getItem('secondaryUser');

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

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!user1Data || !user2Data)
    return <div className="p-4 text-black bg-gray-300 h-screen">Loading...</div>;

  const allRatings = Array.from(
    new Set([
      ...Object.keys(user1Data.ratingMap).map(Number),
      ...Object.keys(user2Data.ratingMap).map(Number),
    ])
  ).sort((a, b) => a - b);

  const isCommon = (problem: Problem, otherSet: Set<string>) =>
    otherSet.has(`${problem.contestId}-${problem.index}`);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Compare Solved Problems by Rating</h1>
      <div className="space-y-4">
        {allRatings.map((rating) => (
          <div key={rating} className="border rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-2">
              Rating: {rating} <br />
              User 1 Count: {user1Data.ratingCount[rating] || 0} | User 2 Count: {user2Data.ratingCount[rating] || 0}
            </h2>
            <Button
              variant="primary"
              size="sm"
              text={expandedRatings.has(rating) ? 'Hide problems' : 'Show problems'}
              onClick={() => toggleRating(rating)}
            />
            {expandedRatings.has(rating) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* User 1 problems */}
                <div>
                  <h3 className="font-semibold mb-1">User 1</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {(user1Data.ratingMap[rating] || []).map((problem, idx) => {
                      const common = isCommon(problem, user2Data.problemSet);
                      return (
                        <li key={idx}>
                          <a
                            href={problem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={common ? 'text-green-600 font-bold' : 'text-blue-600 hover:underline'}
                          >
                            {problem.name} ({problem.index})
                            {common && ' ⭐'}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {/* User 2 problems */}
                <div>
                  <h3 className="font-semibold mb-1">User 2</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {(user2Data.ratingMap[rating] || []).map((problem, idx) => {
                      const common = isCommon(problem, user1Data.problemSet);
                      return (
                        <li key={idx}>
                          <a
                            href={problem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={common ? 'text-green-600 font-bold' : 'text-blue-600 hover:underline'}
                          >
                            {problem.name} ({problem.index})
                            {common && ' ⭐'}
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
  );
}

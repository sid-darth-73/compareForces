import { useEffect, useState } from 'react';
import { SubmissionApi } from '../api/SubmissionApi';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/ui/Navbar';

async function getSolvedProblemsByRating(handle: string): Promise<{
  ratingMap: Record<number, { name: string; contestId: number; index: string; url: string }[]>,
  ratingCount: Record<number, number>
}> {
  const res = await fetch(SubmissionApi(handle));
  const data = await res.json();

  if (data.status !== 'OK') {
    throw new Error("Failed to fetch data");
  }

  const submissions = data.result;
  const solvedSet = new Set();
  const ratingMap: Record<number, { name: string; contestId: number; index: string; url: string }[]> = {};
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
      url: `https://codeforces.com/contest/${sub.problem.contestId}/problem/${sub.problem.index}`
    });

    ratingCount[rating] += 1;
  }

  return { ratingMap, ratingCount };
}

export function ProblemDistributionSingle() {
  const [problemsByRating, setProblemsByRating] = useState<Record<number, any[]> | null>(null);
  const [ratingCount, setRatingCount] = useState<Record<number, number> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedRatings, setExpandedRatings] = useState<Set<number>>(new Set());

  useEffect(() => {
    const user = localStorage.getItem("primaryUser");
    if (!user) {
      setError("No user found in localStorage");
      return;
    }

    getSolvedProblemsByRating(user)
      .then(({ ratingMap, ratingCount }) => {
        setProblemsByRating(ratingMap);
        setRatingCount(ratingCount);
      })
      .catch((err) => setError(err.message));
  }, []);

  const toggleRating = (rating: number) => {
    setExpandedRatings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rating)) {
        newSet.delete(rating);
      } else {
        newSet.add(rating);
      }
      return newSet;
    });
  };

  if(error) {
    return <div className="p-4 text-red-400 bg-slate-800 min-h-screen">{error}</div>;
  }

  if(!problemsByRating || !ratingCount) {
    return <div className="p-4 text-white bg-slate-800 min-h-screen">Loading...</div>;
  }

  const sortedRatings = Object.keys(problemsByRating)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div>
      <Navbar />
      <div className="bg-slate-800 min-h-screen p-4 text-white">
        <h1 className="text-2xl mb-6">Solved Problems by Rating</h1>
        <div className="space-y-6">
          {sortedRatings.map((rating) => (
            <div
              key={rating}
              className="p-4 rounded-lg bg-slate-700 border border-slate-600 transition-all duration-200 hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Rating: {rating==0?"Unrated":rating}</h2>
                <Button
                  variant="primary"
                  size="sm"
                  text={expandedRatings.has(rating) ? 'Hide problems' : 'Show problems'}
                  onClick={() => toggleRating(rating)}
                />
              </div>
              <div className="text-gray-300 font-mono mb-3">
                {ratingCount[rating]} {ratingCount[rating]>1 ? "problems": "problem"}
              </div>
              {expandedRatings.has(rating) && (
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  {problemsByRating[rating].map((problem, index) => (
                    <li key={index}>
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {problem.name} ({problem.index})
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

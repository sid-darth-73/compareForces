import React, { useEffect, useState } from 'react';
import axios from 'axios';
async function getSolvedProblemsByRating(handle: string) {
  const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1`);
  const data = await res.json();

  if (data.status !== 'OK') {
    throw new Error("Failed to fetch data");
  }

  const submissions = data.result;
  const solvedSet = new Set();
  const ratingMap: Record<number, { name: string; contestId: number; index: string; url: string }[]> = {};

  for (const sub of submissions) {
    if (sub.verdict !== 'OK' || !sub.problem.rating) continue;

    const key = `${sub.problem.contestId}-${sub.problem.index}`;
    if (solvedSet.has(key)) continue;

    solvedSet.add(key);
    const rating = sub.problem.rating;
    if (!ratingMap[rating]) ratingMap[rating] = [];

    ratingMap[rating].push({
      name: sub.problem.name,
      contestId: sub.problem.contestId,
      index: sub.problem.index,
      url: `https://codeforces.com/contest/${sub.problem.contestId}/problem/${sub.problem.index}`
    });
  }

  return ratingMap;
}

export function ProblemDistributionSingle() {
  const [problemsByRating, setProblemsByRating] = useState<Record<number, any[]> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("primaryUser");
    if (!user) {
      setError("No user found in localStorage");
      return;
    }

    getSolvedProblemsByRating(user)
      .then(setProblemsByRating)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!problemsByRating) {
    return <div className="p-4 text-gray-600">Loading...</div>;
  }

  const sortedRatings = Object.keys(problemsByRating)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Solved Problems by Rating</h1>
      <div className="space-y-4">
        {sortedRatings.map((rating) => (
          <div key={rating} className="border rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-2">Rating: {rating}</h2>
            <ul className="list-disc pl-5 space-y-1">
              {problemsByRating[rating].map((problem, index) => (
                <li key={index}>
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {problem.name} ({problem.index})
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

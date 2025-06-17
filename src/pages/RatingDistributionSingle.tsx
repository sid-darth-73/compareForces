import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RatingChangesApi } from "../api/RatingChangesApi";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

async function getRatingChanges(handle: string): Promise<Array<{
  contestId: number,
  contestName: string,
  oldRating: number,
  newRating: number,
  time: number
}>> {
  const res = await fetch(RatingChangesApi(handle));
  const data = await res.json();
  if (data.status !== 'OK') {
    throw new Error("Failed to fetch data");
  }

  const ratingChanges = data.result.map((contest: any) => ({
    contestId: contest.contestId,
    contestName: contest.contestName,
    oldRating: contest.oldRating,
    newRating: contest.newRating,
    time: contest.ratingUpdateTimeSeconds
  }));

  ratingChanges.sort((a: any, b: any) => a.time - b.time);

  return ratingChanges;
}

export function RatingDistributionSingle() {
  const user = localStorage.getItem("primaryUser");
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<Array<{
    contestId: number,
    contestName: string,
    oldRating: number,
    newRating: number,
    time: number
  }>>([]);

  useEffect(() => {
    if (!user) return;

    getRatingChanges(user)
      .then((ratingData) => {
        setChartData(ratingData);
      })
      .catch((error) => {
        console.error("Error fetching rating changes:", error);
      });
  }, [user]);

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div className="p-4 h-screen bg-gray-900 text-white">
      <h1 className="text-xl font-bold mb-4">Rating History for {user}</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="contestId"
            tick={false}
            label={{ value: 'Contests', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            domain={([min, max]) => [min - 100, max + 100]}
            label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white text-black p-2 rounded shadow">
                    <p><strong>{data.contestName}</strong></p>
                    <p>Old Rating: {data.oldRating}</p>
                    <p>New Rating: {data.newRating}</p>
                    <p>{new Date(data.time * 1000).toLocaleDateString()}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="newRating"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <button
        onClick={() => navigate("/singleUser")}
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
      >
        Back
      </button>
    </div>
  );
}

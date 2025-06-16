import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RatingChangesApi } from "../api/RatingChangesApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


type ChartEntry = {
  index: number;
  contestName: string;
  user1Rating?: number;
  user2Rating?: number;
};


async function getRatingChanges(handle: string): Promise<{ contestName: string; rating: number }[]> {
  const res = await fetch(RatingChangesApi(handle));
  const data = await res.json();

  if (data.status !== "OK") {
    throw new Error("Failed to fetch data");
  }

  return data.result
    .sort((a: any, b: any) => a.ratingUpdateTimeSeconds - b.ratingUpdateTimeSeconds)
    .map((contest: any) => ({
      contestName: contest.contestName,
      rating: contest.newRating,
    }));
}

export function RatingDistributionMultiple() {
  const user1 = localStorage.getItem("primaryUser");
  const user2 = localStorage.getItem("secondaryUser");
  const navigate = useNavigate();

  const [chartData, setChartData] = useState<ChartEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user1 || !user2) {
      setError("Missing user(s) in localStorage");
      return;
    }

    Promise.all([getRatingChanges(user1), getRatingChanges(user2)])
      .then(([user1Data, user2Data]) => {
        const maxLength = Math.max(user1Data.length, user2Data.length);
        const merged: ChartEntry[] = [];

        for (let i = 0; i < maxLength; i++) {
          merged.push({
            index: i,
            contestName: user1Data[i]?.contestName || user2Data[i]?.contestName || `Contest ${i + 1}`,
            user1Rating: user1Data[i]?.rating,
            user2Rating: user2Data[i]?.rating,
          });
        }

        setChartData(merged);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch rating data.");
      });
  }, [user1, user2]);

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="p-4 h-screen bg-gray-900 text-white">
      <h1 className="text-xl font-bold mb-4">Rating Comparison</h1>

      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="index"
            tick={false}
            label={{ value: "Contests", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            label={{ value: "Rating", angle: -90, position: "insideLeft" }}
            domain={["dataMin - 100", "dataMax + 100"]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white text-black p-2 rounded shadow">
                    <p><strong>{data.contestName}</strong></p>
                    <p>{user1}: {data.user1Rating ?? "N/A"}</p>
                    <p>{user2}: {data.user2Rating ?? "N/A"}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="user1Rating"
            name={user1 ?? "User 1"}
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="user2Rating"
            name={user2 ?? "User 2"}
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <button
        onClick={() => navigate("/multipleUser")}
        className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
      >
        Back
      </button>
    </div>
  );
}

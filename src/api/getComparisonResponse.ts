import { GoogleGenerativeAI } from "@google/generative-ai";
import {type Submission } from "./GetUserSubmissions"; 

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export async function getComparisonResponse({
  user1,
  user2,
  userInfo1,
  userInfo2,
  subs1,
  subs2,
  problemCount1,
  problemCount2,
  highRatedCount1,
  highRatedCount2,
}: {
  user1: string;
  user2: string;
  userInfo1: any;
  userInfo2: any;
  subs1: Submission[]; 
  subs2: Submission[]; 
  problemCount1: number;
  problemCount2: number;
  highRatedCount1: number;
  highRatedCount2: number;
}) {
  const acCount1 = subs1.filter((s) => s.verdict === "OK").length;
  const acCount2 = subs2.filter((s) => s.verdict === "OK").length;

  const prompt = `
Compare two Codeforces users based on the following data. Choose who is the better competitive programmer.

User 1: ${user1}
- Rating: ${userInfo1.rating}
- Max Rating: ${userInfo1.maxRating}
- Rank: ${userInfo1.rank}
- Max Rank: ${userInfo1.maxRank}
- Friend Count: ${userInfo1.friendOfCount}
- Contribution: ${userInfo1.contribution}
- Recent Accepted Submissions: ${acCount1} out of ${subs1.length} total submissions
- Unique Solved Problems: ${problemCount1}, including ${highRatedCount1} problems rated above 2000

User 2: ${user2}
- Rating: ${userInfo2.rating}
- Max Rating: ${userInfo2.maxRating}
- Rank: ${userInfo2.rank}
- Max Rank: ${userInfo2.maxRank}
- Friend Count: ${userInfo2.friendOfCount}
- Contribution: ${userInfo2.contribution}
- Recent Accepted Submissions: ${acCount2} out of ${subs2.length} total submissions
- Unique Solved Problems: ${problemCount2}, including ${highRatedCount2} problems rated above 2000

Write a fun, snarky comparison (like a sarcastic but smart friend) that:
- Clearly declares who is better
- Praises the winner confidently
- Makes cheeky, lighthearted remarks about the loser (without sounding cruel)
- Uses wit and coding puns where appropriate.
- Keep the response atleast 200 words, comment on all the aspects of the provided data.
`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const result = await model.generateContent(prompt);

    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    console.error("Error generating comparison with Gemini API:", error);
    throw new Error("Failed to get comparison from AI.");
  }
}

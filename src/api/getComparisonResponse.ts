import { GoogleGenerativeAI } from "@google/generative-ai";
import {type Submission } from "./GetUserSubmissions.ts"; 

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
export async function getComparisonResponse({
  user1,
  user2,
  userInfo1,
  userInfo2,
}: {
  user1: string;
  user2: string;
  userInfo1: any;
  userInfo2: any;
  subs1: Submission[]; 
  subs2: Submission[]; 
  highCount1: number;
  highCount2: number;
}) {

  const prompt = `
Compare two Codeforces users based on the following data. Choose who is the better competitive programmer.
User 1: ${user1}
- Rating: ${userInfo1.rating}
- Max Rating: ${userInfo1.maxRating}
- Rank: ${userInfo1.rank}
- Max Rank: ${userInfo1.maxRank}
- Friend Count: ${userInfo1.friendOfCount}
- Contribution: ${userInfo1.contribution}
- Last Online Time: ${userInfo1.lastOnlineTimeSeconds}

User 2: ${user2}
- Rating: ${userInfo2.rating}
- Max Rating: ${userInfo2.maxRating}
- Rank: ${userInfo2.rank}
- Max Rank: ${userInfo2.maxRank}
- Friend Count: ${userInfo2.friendOfCount}
- Contribution: ${userInfo2.contribution}
- Last Online Time: ${userInfo2.lastOnlineTimeSeconds}

Write a fun, snarky comparison (like a sarcastic but smart friend) that:
- Clearly declares who is better
- Praises the winner confidently
- Makes cheeky, lighthearted remarks about the loser (without sounding cruel)
- Uses wit and coding puns where appropriate.
- Keep the response atleast 300 words, comment on all the aspects of the provided data.

Suggest the loser on how can he beat the other person, along with their provided data, use generic advices like:
- Keep solving more problems with rating +200 of their current rating
- Keeping calm when giving contests
- Give this advice "um_nik says that don't waste time learning random algorithms, learn binary search first. Are your basics clear?"
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

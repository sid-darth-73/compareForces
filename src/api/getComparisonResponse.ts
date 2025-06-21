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
}) {
  try {
    const response = await fetch("https://backend-compareforces.onrender.com/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user1, user2, userInfo1, userInfo2 }),
    });

    const data = await response.json();
    return data.result;
  } catch (err) {
    console.error("Error fetching comparison from backend:", err);
    throw new Error("Comparison failed.");
  }
}

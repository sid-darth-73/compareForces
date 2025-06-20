import { type Submission } from "../api/GetUserSubmissions";

export function countHighRatedProblems(subs: Submission[]): number {
  const seen = new Set<string>();
  subs.forEach((sub) => {
    if ((sub.verdict === "OK" || sub.verdict === "ACCEPTED") && sub.problem.rating && sub.problem.rating >= 2000) {
      seen.add(sub.problem.name);
    }
  });
  return seen.size;
}

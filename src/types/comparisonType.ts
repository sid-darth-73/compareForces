// Create a new file or add to existing types
export interface StreamUpdatePayload {
  type: "update";
  node: string;
  message: { content: string; type: string } | string; // LangChain messages usually have content
  current_scores: {
    user1: number;
    user2: number;
  };
}

export interface StreamCompletePayload {
  type: "complete";
  user1: string;
  user2: string;
  user1_score: number;
  user2_score: number;
  verdict_log: Array<{ content: string }>; // Array of messages
}
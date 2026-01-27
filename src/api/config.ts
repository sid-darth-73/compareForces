// Central place to configure backend base URLs.
// Falls back to localhost for local development.
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000";


import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar.tsx";
import { Button } from "../components/ui/Button.tsx";

export function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl px-8 py-10 max-w-md w-full text-center shadow-lg">
          <h1 className="text-2xl font-mont mb-3">Missing handle</h1>
          <p className="text-sm text-gray-300 font-quick mb-6">
            Please enter at least one Codeforces handle to continue.
          </p>
          <Button
            variant="primary"
            size="md"
            text="Go back and try again"
            onClick={() => navigate("/")}
            fullWidth
          />
        </div>
      </main>
    </div>
  );
}

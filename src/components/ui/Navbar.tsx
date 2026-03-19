import { useNavigate } from "react-router-dom";
import { Swords } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b-0 border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="p-2 bg-slate-800/80 rounded-xl group-hover:bg-slate-700/80 transition-colors">
              <Swords className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
            <div className="text-2xl font-outfit font-bold tracking-tight">
              Compare<span className="gradient-text">Forces</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { Navbar };

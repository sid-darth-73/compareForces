import { useRef, useEffect } from "react";
import { Button } from "../components/ui/Button.tsx";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input.tsx";
import { HeartIcon } from "../components/ui/HeartIcon.tsx";
import { Swords } from "lucide-react";

export function EntryPage() {
    const primaryUserNameRef = useRef<HTMLInputElement>(null);
    const secondaryUserNameRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    function store() {
        const primaryUser = primaryUserNameRef.current?.value?.trim();
        if (!primaryUser) {
            navigate("/error");
            return;
        }

        const secondaryUser = secondaryUserNameRef.current?.value?.trim();
        localStorage.setItem("primaryUser", primaryUser);

        if (!secondaryUser) {
            navigate("/singleuser");
        } else {
            localStorage.setItem("secondaryUser", secondaryUser);
            navigate("/multipleuser");
        }
    }

    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            if (e.key === "Enter") {
                store();
            }
        }

        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, []);

    return (
        <div className="relative flex flex-col justify-between min-h-screen bg-slate-900 text-white p-4 overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse flex-row-reverse mix-blend-screen pointer-events-none" style={{ animationDelay: "2s" }}></div>

            <div className="relative z-10 flex flex-col flex-grow items-center justify-center">
                <div className="glass-panel rounded-3xl p-10 w-full max-w-lg space-y-8 relative overflow-hidden">
                    
                    {/* Floating decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                    
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center p-4 bg-slate-800/80 rounded-2xl shadow-inner mb-2 border border-slate-700/50">
                            <Swords className="w-10 h-10 text-purple-400" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-4xl font-outfit font-bold tracking-tight">
                            Compare<span className="gradient-text">Forces</span>
                        </h1>
                        <p className="text-slate-400 font-quick text-sm">
                            Discover your Codeforces legacy or roast your rivals.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Input
                            placeholder="Enter your Codeforces handle"
                            reference={primaryUserNameRef}
                        />
                        <div className="flex items-center justify-center">
                            <span className="text-xs font-mont tracking-widest text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                                VS (OPTIONAL)
                            </span>
                        </div>
                        <Input
                            placeholder="Opponent's handle (leave blank for solo mode)"
                            reference={secondaryUserNameRef}
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            variant="primary"
                            text="Begin Analysis"
                            size="lg"
                            fullWidth
                            onClick={store}
                        />
                    </div>
                </div>
            </div>

            <footer className="relative z-10 text-center text-slate-500 text-sm mt-8 mb-4 font-quick flex items-center justify-center space-x-2">
                <span>Built with</span>
                <HeartIcon />
                <span>by</span>
                <a href="https://github.com/sid-darth-73/compareForces" className="text-purple-400 hover:text-purple-300 transition-colors">
                    unbit
                </a>
            </footer>
        </div>
    );
}

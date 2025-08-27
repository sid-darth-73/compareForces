import { useRef, useEffect } from "react";
import { Button } from "../components/ui/Button.tsx";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input.tsx";
import { HeartIcon } from "../components/ui/HeartIcon.tsx";
export function EntryPage() {
    const primaryUserNameRef = useRef<HTMLInputElement>(null);
    const secondaryUserNameRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    function store() {
        const primaryUser = primaryUserNameRef.current?.value?.trim();
        if (!primaryUser) {
            navigate("/Error");
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
        <div className="flex flex-col justify-between min-h-screen bg-slate-900 text-white p-4">
            <div className="flex flex-grow items-center justify-center">
                <div className="bg-slate-800 rounded-xl p-8 w-full max-w-lg shadow-lg space-y-6">
                    <h1 className="text-2xl text-center mb-2 font-mont">Welcome to Compare Forces!</h1>
                    <Input
                        placeholder="Enter your Codeforces handle"
                        reference={primaryUserNameRef}
                    />
                    <Input
                        placeholder="Enter your friend's Codeforces handle"
                        reference={secondaryUserNameRef}
                    />
                    <div className="flex items-center justify-center animate-bounce">
                        <Button
                            variant="primary"
                            text="Compare Them!"
                            size="md"
                            onClick={store}
                        />
                    </div>
                </div>
            </div>

            <footer className=" text-center text-gray-400 text-sm mt-8 mb-2 font-quick ">
                <div className="flex items-center justify-center">
                <div> Made with  </div>
                <div> <HeartIcon/> </div>
                <div>  by <a href="https://github.com/sid-darth-73/compareForces"> unbit</a></div>
                </div>
            </footer>
        </div>
    );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [userName, setUserName] = useState("");
  const [isWideScreen, setIsWideScreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem("primaryUser") || "");

    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 768);
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900 border-b border-neutral-600">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center">
          {/* Clickable CompareForces */}
          <div
            onClick={() => navigate("/")}
            className="px-6 text-3xl text-black dark:text-white border-r border-neutral-600 h-20 flex items-center font-quick font-extralight cursor-pointer hover:text-purple-400 transition duration-200"
          >
            CompareForces
          </div>
        </div>
      </div>
    </nav>
  );
}

export { Navbar };

import { useEffect, useState } from "react";

function Navbar() {
  const [userName, setUserName] = useState("");
  const [isWideScreen, setIsWideScreen] = useState(false);

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
          <div className="px-6 text-3xl font-light text-black dark:text-white border-r border-neutral-600 h-20 flex items-center">
            Compare Forces
          </div>
        </div>

        {isWideScreen && (
          <div className="flex items-center">
            <div className="text-black dark:text-white px-4 text-2xl">
              {userName || "guest"}
            </div>
            {/* add toggle for dark/light in future */}
          </div>
        )}
      </div>
    </nav>
  );
}

export { Navbar };

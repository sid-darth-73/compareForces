interface InfoCardI {
    text: string;
    value: number | string;
    ActionButton?: any;
}

export function InfoCard({ text, value }: InfoCardI) {
    return (
        <div className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-sm font-quick font-bold text-slate-400 uppercase tracking-wider mb-2">
                {text}
            </h3>
            <div className="text-3xl font-outfit font-bold text-white group-hover:bg-clip-text group-hover:-webkit-text-fill-color-transparent group-hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400 transition-all">
                {value}
            </div>
        </div>
    );
}
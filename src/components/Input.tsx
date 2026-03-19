interface InputInterface {
    reference?: any;
    placeholder: string;
}

export function Input({ placeholder, reference }: InputInterface) {
    return (
        <div className="w-full">
            <input
                ref={reference}
                placeholder={placeholder}
                type="text"
                className="w-full px-5 py-4 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl font-quick text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-inner"
            />
        </div>
    );
}

import { Loader2 } from "lucide-react";

export interface ButtonProps {
    variant: "primary" | "secondary";
    size: "md" | "sm" | "lg";
    startIcon?: any;
    endIcon?: any;
    text: string;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
}

const sizeStyles = {
    "md": "px-6 py-3 text-base rounded-xl",
    "lg": "px-8 py-4 text-lg rounded-2xl",
    "sm": "px-4 py-2 text-sm rounded-lg",
};

const variantStyles = {
    "primary": "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/30 border border-white/10",
    "secondary": "bg-slate-800/80 backdrop-blur-md text-purple-300 border border-purple-500/30 hover:bg-slate-700/80 hover:text-purple-200",
};

const defaultStyle = "font-quick font-semibold cursor-pointer transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";

export function Button(props: ButtonProps) {
    const StartIcon = props.startIcon;

    return (
        <button
            onClick={props.onClick}
            disabled={props.loading}
            className={`${sizeStyles[props.size]} ${variantStyles[props.variant]} ${defaultStyle} ${props.fullWidth ? "w-full" : ""} ${props.loading ? "opacity-75 cursor-not-allowed scale-100" : "hover:-translate-y-0.5"}`}
        >
            {props.loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : StartIcon ? (
                <StartIcon size={props.size === "sm" ? 16 : 20} />
            ) : null}
            
            <span>{props.text}</span>
            
            {!props.loading && props.endIcon && (
                <span>{props.endIcon}</span>
            )}
        </button>
    );
}

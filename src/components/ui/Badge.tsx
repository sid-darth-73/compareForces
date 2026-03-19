import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const baseClasses =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900";

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "border-transparent bg-green-500/20 text-green-400 hover:bg-green-500/30",
  secondary:
    "border-transparent bg-slate-700/50 text-slate-300 hover:bg-slate-700/70",
  destructive:
    "border-transparent bg-red-500/20 text-red-400 hover:bg-red-500/30",
  outline: "text-slate-300 border-slate-600",
};

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  const variantClass = variantClasses[variant] || variantClasses.default;
  return (
    <div className={`${baseClasses} ${variantClass} ${className}`} {...props} />
  );
}

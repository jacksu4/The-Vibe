import { cn } from "@/lib/utils";
import React from "react";
import { Search } from "lucide-react";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch?: (value: string) => void;
}

export function GlassInput({ className, onSearch, ...props }: GlassInputProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && onSearch) {
            onSearch(e.currentTarget.value);
        }
    };

    return (
        <div className="relative group w-full max-w-xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center">
                <input
                    className={cn(
                        "w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-full py-4 px-6 pl-12 text-lg text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-xl",
                        className
                    )}
                    placeholder="Describe your vibe..."
                    onKeyDown={handleKeyDown}
                    {...props}
                />
                <Search className="absolute left-4 w-5 h-5 text-white/50" />
            </div>
        </div>
    );
}

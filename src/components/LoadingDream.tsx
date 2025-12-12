import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function LoadingDream({ status }: { status: string }) {
    const messages = {
        generating_image: "Dreaming up the scene...",
        generating_video: "Bringing the dream to life (Animation)...",
        generating_audio: "Composing the perfect melody...",
    };

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-8">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                    rotate: [0, 180, 360],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400/30 to-purple-500/30 blur-3xl"
            >
                <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-white/80" />
                </div>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={status} // Animate when key changes
                className="text-2xl font-light tracking-widest text-white/80"
            >
                {messages[status as keyof typeof messages] || "Thinking..."}
            </motion.h2>
        </div>
    );
}

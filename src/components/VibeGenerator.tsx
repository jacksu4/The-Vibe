"use client";

import { useGeneration } from "@/hooks/use-generation";
import { GlassInput } from "./ui/GlassInput";
import { LoadingDream } from "./LoadingDream";
import { AmbientPlayer } from "./AmbientPlayer";
import { motion, AnimatePresence } from "framer-motion";

export function VibeGenerator() {
    const { generate, reset, state } = useGeneration();

    const handleSearch = (prompt: string) => {
        generate(prompt);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center min-h-screen relative overflow-hidden">

            {/* Background for Idle State */}
            {state.status === "idle" && (
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#020b1f] to-black" />
            )}

            {/* Temporary Image Background while generating media */}
            <AnimatePresence>
                {state.image && !state.video && (
                    <motion.img
                        key="temp-image"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={state.image}
                        className="absolute inset-0 w-full h-full object-cover -z-10 blur-sm scale-105"
                    />
                )}
            </AnimatePresence>


            <AnimatePresence mode="wait">
                {state.status === "idle" && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="w-full px-4 z-10 flex flex-col items-center gap-8"
                    >
                        <h1 className="text-6xl md:text-8xl font-thin tracking-tighter text-white/90 drop-shadow-2xl text-center">
                            The Vibe
                        </h1>
                        <GlassInput onSearch={handleSearch} autoFocus />
                    </motion.div>
                )}

                {(state.status === "generating_image" || state.status === "generating_video" || state.status === "generating_audio") && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="z-10"
                    >
                        <LoadingDream status={state.status} />
                    </motion.div>
                )}

                {state.status === "completed" && state.video && (
                    <motion.div
                        key="player"
                        className="absolute inset-0 z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                    >
                        <AmbientPlayer videoUrl={state.video} audioUrl={state.audio} onReset={reset} />
                    </motion.div>
                )}
            </AnimatePresence>

            {state.error && (
                <div className="absolute bottom-10 text-red-400 bg-red-950/20 backdrop-blur px-4 py-2 rounded-lg border border-red-900/50">
                    Error: {state.error}
                </div>
            )}
        </div>
    );
}

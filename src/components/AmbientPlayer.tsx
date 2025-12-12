import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AmbientPlayerProps {
    videoUrl: string;
    audioUrl?: string | null;
    onReset: () => void;
}

export function AmbientPlayer({ videoUrl, audioUrl, onReset }: AmbientPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            // Force reload to ensure new source is picked up
            videoRef.current.load();
            videoRef.current.play().catch((e) => {
                console.warn("Autoplay failed", e);
                // Don't show error immediately, browser throttling might just need user interaction
            });
        }
    }, [videoUrl]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleVideoError = (e: any) => {
        console.error("Video Error:", e.currentTarget.error);
        setError("Failed to load video stream. The link might have expired.");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="relative w-full h-screen overflow-hidden bg-black"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {/* Video Background */}
            <video
                ref={videoRef}
                src={videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                playsInline
                autoPlay
                muted // Background video always muted
                onError={handleVideoError}
            />

            {/* Audio Track */}
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    loop
                    autoPlay
                />
            )}

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                    <div className="bg-red-900/80 text-white p-6 rounded-xl backdrop-blur">
                        <p>{error}</p>
                        <button onClick={onReset} className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Controls Overlay */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 z-10",
                showControls ? "opacity-100" : "opacity-0"
            )}>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={toggleMute}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition text-white"
                    >
                        {isMuted ? <VolumeX /> : <Volume2 />}
                    </button>
                    <button
                        onClick={onReset}
                        className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition text-white font-light tracking-wider border border-white/10"
                    >
                        NEW VIBE
                    </button>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={toggleFullscreen}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition text-white"
                    >
                        {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

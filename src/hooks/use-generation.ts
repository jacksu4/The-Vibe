"use client";

import { useState } from "react";

export type GenerationStatus =
    | "idle"
    | "generating_image"
    | "generating_video"
    | "generating_audio"
    | "completed"
    | "error";

interface GenerationState {
    status: GenerationStatus;
    image: string | null;
    video: string | null;
    audio: string | null;
    error: string | null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useGeneration() {
    const [state, setState] = useState<GenerationState>({
        status: "idle",
        image: null,
        video: null,
        audio: null,
        error: null,
    });

    const generate = async (prompt: string) => {
        setState({
            status: "generating_image",
            image: null,
            video: null,
            audio: null,
            error: null,
        });

        try {
            // 1. Generate Image
            const imagePrediction = await createPrediction("image", prompt);
            const imageUrl = await pollPrediction(imagePrediction.id);

            setState((prev) => ({
                ...prev,
                status: "generating_video",
                image: imageUrl,
            }));

            // Wait a bit to avoid rate limits
            await sleep(3000);

            // 2. Generate Video
            let videoUrl: string | null = null;
            try {
                const videoPred = await createPrediction("video", prompt, imageUrl);
                videoUrl = await pollPrediction(videoPred.id);
                setState((prev) => ({ ...prev, video: videoUrl, status: "generating_audio" }));
            } catch (e) {
                console.error("Video generation failed", e);
                throw new Error("Failed to animate the scene.");
            }

            // Wait a bit to avoid rate limits
            await sleep(3000);

            // 3. Generate Music
            try {
                const musicPred = await createPrediction("music", prompt);
                const audioUrl = await pollPrediction(musicPred.id);
                setState((prev) => ({ ...prev, audio: audioUrl }));
            } catch (e) {
                console.error("Music generation failed", e);
                // Continue without music if it fails
            }

            setState((prev) => ({
                ...prev,
                status: "completed",
            }));

        } catch (error) {
            console.error(error);
            setState((prev) => ({
                ...prev,
                status: "error",
                error: (error as Error).message || "Something went wrong",
            }));
        }
    };

    const reset = () => {
        setState({
            status: "idle",
            image: null,
            video: null,
            audio: null,
            error: null,
        });
    };

    return { generate, reset, state };
}

async function createPrediction(type: "image" | "music" | "video", prompt: string, inputImage?: string) {
    const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, prompt, inputImage }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to create prediction");
    }

    return response.json();
}

async function pollPrediction(id: string): Promise<string> {
    let prediction;

    while (true) {
        const response = await fetch(`/api/predictions/${id}`);
        prediction = await response.json();

        if (response.status !== 200) {
            throw new Error(prediction.detail || "Polling failed");
        }

        if (prediction.status === "succeeded") {

            // Replicate SVD/SDXL usually returns an array of strings (URLs)
            // If it's an array, take the first one; otherwise return as is.
            if (Array.isArray(prediction.output)) {
                return prediction.output[0];
            }
            return prediction.output;
        } else if (prediction.status === "failed" || prediction.status === "canceled") {
            throw new Error("Prediction failed");
        }

        await sleep(2000);
    }
}

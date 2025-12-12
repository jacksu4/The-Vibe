import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// Model Versions
const MODELS = {
    image: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // Fallback/generic version, usually just model owner/name is enough for latest
    music: "meta/musicgen:b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
    video: "stability-ai/stable-video-diffusion:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
};

export async function POST(request: Request) {
    if (!process.env.REPLICATE_API_TOKEN) {
        return NextResponse.json(
            { error: "REPLICATE_API_TOKEN not set" },
            { status: 500 }
        );
    }

    const { prompt, type, inputImage } = await request.json();

    let prediction;

    try {
        if (type === "image") {
            // Revert to standard SDXL for stability (The lightning version hash was invalid)
            prediction = await replicate.predictions.create({
                version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // Standard SDXL
                input: {
                    prompt: `lofi style, anime style, ${prompt}, detailed, atmospheric, 8k, highly detailed`,
                    width: 1024,
                    height: 1024,
                    refine: "expert_ensemble_refiner",
                },
            });
        } else if (type === "music") {
            // Revert to standard MusicGen
            prediction = await replicate.predictions.create({
                version: "b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
                input: {
                    prompt: `lofi hip hop, chill, ambient, ${prompt}`,
                    model_version: "stereo-large",
                    duration: 30
                }
            });
        } else if (type === "video") {
            // Stable Video Diffusion
            prediction = await replicate.predictions.create({
                version: "3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438", // Verified SVD Hash
                input: {
                    input_image: inputImage,
                    video_length: "25_frames_with_svd_xt",
                    frames_per_second: 6,
                    motion_bucket_id: 127,
                    cond_aug: 0.02,
                },
            });
        } else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        return NextResponse.json(prediction, { status: 201 });
    } catch (error) {
        console.error("Prediction error:", error);
        return NextResponse.json({ detail: (error as Error).message }, { status: 500 });
    }
}

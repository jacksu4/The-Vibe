import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const predictionId = id;

    try {
        const prediction = await replicate.predictions.get(predictionId);

        if (prediction?.error) {
            return NextResponse.json({ detail: prediction.error }, { status: 500 });
        }

        return NextResponse.json(prediction);
    } catch (error) {
        return NextResponse.json({ detail: (error as Error).message }, { status: 500 });
    }
}

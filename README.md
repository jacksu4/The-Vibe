# The Vibe | AI Lofi Generator

**The Vibe** is a modern, premium web application that generates personalized "Lofi Girl" style ambient experiences using AI.

Enter a prompt (e.g., *"A futuristic cyberpunk city in the rain"*), and the app will generate:
1.  **Visuals**: An animated, looping background video (Stable Video Diffusion).
2.  **Audio**: A matching ambient lo-fi music track (Facebook MusicGen).
3.  **Atmosphere**: A seamless, immersive player interface.

## Features

-   **Generative AI Pipeline**: Integration with Replicate API for Image (SDXL), Video (SVD), and Audio (MusicGen).
-   **Sequential Generation**: Optimized to respect API rate limits and ensure stability.
-   **Premium UI**: Glassmorphism design, smooth Framer Motion transitions, and interactive loading states.
-   **Robust Playback**: Custom video player with error handling, regeneration, and auto-looping.

## Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS v4
-   **Animation**: Framer Motion
-   **AI Infrastructure**: Replicate API

## Getting Started

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/your-username/The-Vibe.git
    cd The-Vibe
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure API Key**:
    -   Get a token from [Replicate](https://replicate.com/account/api-tokens).
    -   Create `.env.local`:
        ```bash
        REPLICATE_API_TOKEN=r8_...
        ```

4.  **Run locally**:
    ```bash
    npm run dev
    ```

## License

MIT

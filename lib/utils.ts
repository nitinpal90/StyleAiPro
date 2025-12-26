
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFriendlyErrorMessage(error: unknown, context: string): string {
    let rawMessage = '';
    if (error instanceof Error) {
        rawMessage = error.message;
    } else if (typeof error === 'string') {
        rawMessage = error;
    } else if (error) {
        rawMessage = JSON.stringify(error);
    }

    // 429 Quota Error Handling (The issue in the user screenshot)
    if (rawMessage.includes("429") || rawMessage.includes("quota exceeded") || rawMessage.includes("RESOURCE_EXHAUSTED")) {
        return "Quota Limit Reached: Your Gemini API free tier has reached its capacity. \n\n1. Wait 60 seconds and retry. \n2. Or, visit https://ai.google.dev/gemini-api/docs/billing to set up a pay-as-you-go project for unlimited usage.";
    }

    // API Key Misconfiguration
    if (rawMessage.includes("MISSING_API_KEY") || rawMessage.includes("API key not found")) {
        return "Configuration Error: No API Key detected. \n\nIf you are on Vercel/Netlify, ensure you added 'VITE_API_KEY' to your Environment Variables and triggered a NEW deployment.";
    }

    // Safety Filter Blocks
    if (rawMessage.toLowerCase().includes("safety") || rawMessage.includes("HARM_CATEGORY")) {
        return "Safety Block: The AI's safety filter blocked this image. Try using a simpler, more professional portrait.";
    }

    // Generic fallback
    return rawMessage.length > 150 ? context : (rawMessage || context);
}

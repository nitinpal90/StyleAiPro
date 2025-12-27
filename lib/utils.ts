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

    // Handle 429 Quota / Resource Exhausted errors
    if (rawMessage.includes("429") || rawMessage.includes("quota exceeded") || rawMessage.includes("RESOURCE_EXHAUSTED")) {
        if (rawMessage.includes("limit: 0")) {
            return "Quota Restriction: Your project is currently at '0 limit'. \n\nFIX: Go to your Google AI Studio billing settings and ensure you have enabled a payment method. Google often restricts free tier users with high activity.";
        }
        return "Rate Limit: Too many requests. Wait 60 seconds and try again. For higher limits, check your billing status at Google AI Studio.";
    }

    // Handle missing API Key
    if (rawMessage.includes("MISSING_API_KEY")) {
        return "Setup Error: API key not detected. Please configure VITE_GOOGLE_API_KEY.";
    }

    // Handle Safety blocks
    if (rawMessage.toLowerCase().includes("safety") || rawMessage.includes("blocked")) {
        return "AI Safety Filter: This image was flagged. Please try a different, more professional photo.";
    }

    return rawMessage.length > 100 ? "A studio error occurred. Please refresh or check your API key." : (rawMessage || context);
}
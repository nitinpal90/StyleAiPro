
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

    // Specific logic for 429 Quota / Limit 0 errors
    if (rawMessage.includes("429") || rawMessage.includes("quota exceeded") || rawMessage.includes("RESOURCE_EXHAUSTED")) {
        if (rawMessage.includes("limit: 0")) {
            return "Critical Quota Error: Your Google AI Studio project has a '0 limit' for this model. \n\nFIX: Go to ai.google.dev and enable Billing for your project. Free tier users are occasionally restricted to 0 requests during high-traffic periods.";
        }
        return "Rate Limit: Too many requests. Please wait 60 seconds. Consider upgrading your plan at ai.google.dev.";
    }

    // Missing API Key
    if (rawMessage.includes("MISSING_API_KEY")) {
        return "Setup Error: API Key not found. \n\nOn Netlify: Add 'API_KEY' to your Environment Variables, then RE-DEPLOY the site.";
    }

    // Filter/Safety
    if (rawMessage.toLowerCase().includes("safety") || rawMessage.includes("blocked")) {
        return "AI Safety Block: The image content was flagged as sensitive. Please try a different photo.";
    }

    return rawMessage.length > 150 ? "A studio error occurred. Please try again." : (rawMessage || context);
}

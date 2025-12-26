
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

    // Capture the 429 quota error and "limit: 0" scenario
    if (rawMessage.includes("429") || rawMessage.includes("quota exceeded") || rawMessage.includes("RESOURCE_EXHAUSTED")) {
        if (rawMessage.includes("limit: 0")) {
            return "Quota Error (Limit 0): This model is restricted for your account tier. \n\n1. Go to Google AI Studio (ai.google.dev). \n2. Check if Billing is enabled for your project. \n3. Ensure the 'gemini-2.5-flash-image' model is enabled in your region.";
        }
        return "Rate Limited: You've sent too many requests. Please wait 60 seconds and try again, or upgrade to a pay-as-you-go plan.";
    }

    if (rawMessage.includes("API_KEY_INVALID") || rawMessage.includes("API key not found")) {
        return "Configuration Error: The API key provided in Vercel is invalid or hasn't propagated yet. Please re-deploy your project in Vercel after double-checking the VITE_API_KEY environment variable.";
    }

    if (rawMessage.toLowerCase().includes("safety")) {
        return "Safety Block: The AI flagged the content as potentially sensitive. Try using a more neutral image.";
    }
    
    return rawMessage.length > 200 ? context : (rawMessage || context);
}

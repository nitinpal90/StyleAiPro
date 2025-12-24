
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
        rawMessage = String(error);
    }

    // Specific check for missing key
    if (rawMessage.includes("API_KEY_MISSING") || rawMessage.includes("API Key must be set") || rawMessage.includes("API_KEY is not defined")) {
        return "Config Error: Gemini API Key is missing. Please add 'API_KEY' to your Vercel Environment Variables and redeploy the project.";
    }

    // Check for specific unsupported MIME type error from Gemini API
    if (rawMessage.toLowerCase().includes("unsupported mime type")) {
        return `File type not supported. Please use PNG, JPEG, or WEBP.`;
    }

    if (rawMessage.includes("API key not found") || (rawMessage.includes("INVALID_ARGUMENT") && rawMessage.includes("key"))) {
        return "The AI service is temporarily unavailable due to an invalid configuration. Please check your API key.";
    }
    
    return rawMessage ? rawMessage : context;
}

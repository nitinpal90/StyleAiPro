
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

    // Capture the exact error shown in the user's screenshot or our custom throw
    const isMissingKey = 
        rawMessage.includes("MISSING_API_KEY_SETUP") || 
        rawMessage.includes("An API Key must be set when running in a browser") ||
        rawMessage.includes("API_KEY_MISSING") ||
        rawMessage.includes("API key not found");

    if (isMissingKey) {
        const platform = window.location.hostname.includes('netlify') ? 'Netlify' : 'Vercel';
        return `Setup Required: Your API key is not active yet. \n\n1. Go to ${platform} Settings -> Environment Variables. \n2. Add 'VITE_API_KEY'. \n3. IMPORTANT: Go to the 'Deploys' tab and trigger a 'NEW DEPLOY' to apply the changes.`;
    }

    if (rawMessage.toLowerCase().includes("unsupported mime type")) {
        return `Format Error: Please use a standard image format like PNG or JPG.`;
    }

    if (rawMessage.includes("INVALID_ARGUMENT")) {
        return "The request was invalid. Please try a different or clearer image.";
    }
    
    return rawMessage ? rawMessage : context;
}

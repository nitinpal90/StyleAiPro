
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

    // Check for specific GenAI SDK error regarding missing API Key
    if (rawMessage.includes("API Key must be set") || rawMessage.includes("API_KEY is not defined")) {
        return "Gemini API Key is missing. Please set the 'API_KEY' environment variable in your project settings to enable AI features.";
    }

    // Check for specific unsupported MIME type error from Gemini API
    if (rawMessage.toLowerCase().includes("unsupported mime type")) {
        return `File type not supported. Please use PNG, JPEG, or WEBP. (AVIF is currently not supported by the AI engine).`;
    }

    if (rawMessage.includes("API key not found") || (rawMessage.includes("INVALID_ARGUMENT") && rawMessage.includes("key"))) {
        return "The AI service is temporarily unavailable due to an invalid configuration. Please contact the administrator.";
    }
    
    return rawMessage ? rawMessage : context;
}

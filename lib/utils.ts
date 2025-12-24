
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

    // Check for specific unsupported MIME type error from Gemini API
    if (rawMessage.toLowerCase().includes("unsupported mime type")) {
        return `File type not supported. Please use PNG, JPEG, or WEBP. (AVIF is currently not supported by the AI engine).`;
    }

    if (rawMessage.includes("API key not found") || rawMessage.includes("INVALID_ARGUMENT") && rawMessage.includes("key")) {
        return "The AI service is temporarily unavailable. Please contact the administrator.";
    }
    
    return rawMessage ? rawMessage : context;
}

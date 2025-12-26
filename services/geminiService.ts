
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Robust API key detection for different deployment platforms.
 * Works with Vercel (VITE_ prefix), Netlify, and standard process envs.
 */
const getApiKey = (): string => {
    // 1. Try standard process.env.API_KEY (System standard)
    if (process.env.API_KEY) return process.env.API_KEY;
    
    // 2. Try VITE_ prefix (Standard for Vite/React dev environments)
    // Note: In some environments like Vite, this is accessed via import.meta.env
    // but the system instruction requires process.env usage.
    const viteKey = (process.env as any).VITE_API_KEY;
    if (viteKey) return viteKey;

    // Fallback error
    throw new Error("MISSING_API_KEY");
};

const handleApiResponse = (response: GenerateContentResponse): string => {
    if (response.promptFeedback?.blockReason) {
        throw new Error(`AI Blocked: ${response.promptFeedback.blockReason}`);
    }

    const candidate = response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find(part => part.inlineData);
    
    if (imagePart?.inlineData) {
        const { mimeType, data } = imagePart.inlineData;
        return `data:${mimeType};base64,${data}`;
    }

    if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
        throw new Error(`AI failed: ${candidate.finishReason}`);
    }
    
    throw new Error("AI returned no image output. Ensure your images are high quality.");
};

const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateModelImage = async (userImage: File): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(userImage);
        reader.onload = () => resolve(reader.result as string);
    });
    
    const mimeType = dataUrl.split(':')[1].split(';')[0];
    const data = dataUrl.split(',')[1];
    const userImagePart = { inlineData: { mimeType, data } };

    const prompt = "PROFESSIONAL PERSONA TRANSFORMATION: Convert this person into a high-end fashion studio portrait. Use 8k photorealistic quality and commercial studio lighting. Preserve facial identity perfectly. Return ONLY the final professional image.";
    
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: [userImagePart, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
    });
    
    return handleApiResponse(response);
};

export const generateVirtualTryOnImage = async (modelImageUrl: string, garmentImage: File): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    const modelMimeType = modelImageUrl.split(':')[1].split(';')[0];
    const modelData = modelImageUrl.split(',')[1];
    const modelImagePart = { inlineData: { mimeType: modelMimeType, data: modelData } };

    const garmentDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(garmentImage);
        reader.onload = () => resolve(reader.result as string);
    });
    const garmentMimeType = garmentDataUrl.split(':')[1].split(';')[0];
    const garmentData = garmentDataUrl.split(',')[1];
    const garmentImagePart = { inlineData: { mimeType: garmentMimeType, data: garmentData } };
    
    const prompt = `EXACT CLOTH INTEGRATION: Put the clothing from the second image onto the model in the first image. 
    Maintain EXACT pattern, color, and texture. Match the model's pose and lighting perfectly.
    Return ONLY the final high-resolution image.`;

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: [modelImagePart, garmentImagePart, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
    });
    
    return handleApiResponse(response);
};

export const generatePoseVariation = async (tryOnImageUrl: string, poseInstruction: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    const mimeType = tryOnImageUrl.split(':')[1].split(';')[0];
    const data = tryOnImageUrl.split(',')[1];
    const tryOnImagePart = { inlineData: { mimeType, data } };
    
    const prompt = `STANCE VARIATION: Change the model's pose to: "${poseInstruction}". Keep identity and clothing EXACTLY as they are. Maintain the studio lighting. Return ONLY the final image.`;
    
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: [tryOnImagePart, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
    });
    
    return handleApiResponse(response);
};

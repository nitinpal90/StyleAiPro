
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getApiKey = () => {
    let key = '';
    
    // 1. Try Vite standard (Works on Netlify, Vercel, Cloudflare, Local)
    try {
        const env = (import.meta as any).env;
        if (env) {
            key = env.VITE_API_KEY || env.API_KEY || '';
        }
    } catch (e) {}

    // 2. Try Node process standard (Backup for CI/CD)
    if (!key || key === 'undefined' || key === '') {
        try {
            key = (process.env as any).VITE_API_KEY || (process.env as any).API_KEY || '';
        } catch (e) {}
    }

    // 3. Try global window injection (Final fallback)
    if (!key || key === 'undefined' || key === '') {
        try {
            key = (window as any).VITE_API_KEY || (window as any).process?.env?.API_KEY || '';
        } catch (e) {}
    }
    
    if (!key || key === 'undefined' || key === '') {
        const platform = window.location.hostname.includes('vercel') ? 'Vercel' : 
                         window.location.hostname.includes('netlify') ? 'Netlify' : 'Host';
        
        const errorMsg = `CONFIG_ERROR: API Key not found. \n\n` +
                        `TO FIX THIS ON ${platform.toUpperCase()}:\n` +
                        `1. Go to your Dashboard -> Site Settings.\n` +
                        `2. Find Environment Variables.\n` +
                        `3. Add a variable named 'VITE_API_KEY' (Must start with VITE_).\n` +
                        `4. Trigger a NEW DEPLOY (this is mandatory to update the code).`;
        throw new Error(errorMsg);
    }
    return key;
};

const fileToPart = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
};

const dataUrlToParts = (dataUrl: string) => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");
    return { mimeType: mimeMatch[1], data: arr[1] };
}

const dataUrlToPart = (dataUrl: string) => {
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
}

const handleApiResponse = (response: GenerateContentResponse): string => {
    if (response.promptFeedback?.blockReason) {
        throw new Error(`AI Blocked: ${response.promptFeedback.blockReason}. This usually happens if the input image violates safety filters.`);
    }

    const candidate = response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find(part => part.inlineData);
    
    if (imagePart?.inlineData) {
        const { mimeType, data } = imagePart.inlineData;
        return `data:${mimeType};base64,${data}`;
    }

    if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
        throw new Error(`AI failed to finish: ${candidate.finishReason}. Try a different, clearer photo.`);
    }
    
    throw new Error("AI completed but returned no image. Please ensure your photo is high-quality and clearly shows a person.");
};

const model = 'gemini-2.5-flash-image';

export const generateModelImage = async (userImage: File): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const userImagePart = await fileToPart(userImage);
    const prompt = "High-end fashion photography. Professional full-body model standing in a studio with a neutral gray background. Photorealistic, 8k resolution, sharp focus. Return ONLY the image.";
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [userImagePart, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
    });
    return handleApiResponse(response);
};

export const generateVirtualTryOnImage = async (modelImageUrl: string, garmentImage: File): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const modelImagePart = dataUrlToPart(modelImageUrl);
    const garmentImagePart = await fileToPart(garmentImage);
    const prompt = "E-commerce virtual try-on. Fit the garment precisely onto the model. Keep face, pose, and background exactly the same. Photorealistic fabric texture. Return ONLY the final image.";
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [modelImagePart, garmentImagePart, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
    });
    return handleApiResponse(response);
};

export const generatePoseVariation = async (tryOnImageUrl: string, poseInstruction: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const tryOnImagePart = dataUrlToPart(tryOnImageUrl);
    const prompt = `Change the model's pose to: "${poseInstruction}". Keep identity, outfit, and studio background identical. Hyper-realistic results only. Return ONLY the image.`;
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [tryOnImagePart, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
    });
    return handleApiResponse(response);
};

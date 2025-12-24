
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getApiKey = () => {
    let key = '';
    
    // 1. Vite / Vercel Client-Side Standard (Most Important)
    try {
        const env = (import.meta as any).env;
        if (env) {
            key = env.VITE_API_KEY || env.API_KEY || '';
        }
    } catch (e) {}

    // 2. Node / CI / Process Fallback
    if (!key || key === 'undefined') {
        try {
            key = (process.env as any).VITE_API_KEY || (process.env as any).API_KEY || '';
        } catch (e) {}
    }

    // 3. Global / Window Fallback
    if (!key || key === 'undefined') {
        try {
            key = (window as any).VITE_API_KEY || (window as any).process?.env?.API_KEY || '';
        } catch (e) {}
    }
    
    if (!key || key === 'undefined' || key === '') {
        const errorMsg = "CONFIG_ERROR: Gemini API Key not found in the browser environment.\n\n" +
                        "TO FIX THIS ON VERCEL:\n" +
                        "1. Go to Project Settings > Environment Variables.\n" +
                        "2. Ensure your variable is named 'VITE_API_KEY' (it must start with VITE_).\n" +
                        "3. Go to the 'Deployments' tab and click 'Redeploy' on your latest build.";
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
        throw new Error(`Request blocked: ${response.promptFeedback.blockReason}`);
    }

    const candidate = response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find(part => part.inlineData);
    
    if (imagePart?.inlineData) {
        const { mimeType, data } = imagePart.inlineData;
        return `data:${mimeType};base64,${data}`;
    }

    if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
        throw new Error(`Generation failed: ${candidate.finishReason}. Try a different image.`);
    }
    
    throw new Error("The AI didn't return an image. Please try a clearer photo.");
};

const model = 'gemini-2.5-flash-image';

export const generateModelImage = async (userImage: File): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const userImagePart = await fileToPart(userImage);
    const prompt = "You are an expert fashion photographer. Transform this person into a professional full-body fashion model. Use a clean neutral gray studio background. Preserve identity and body shape. Return ONLY the image.";
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
    const prompt = "Virtual try-on: Replace the clothing on the model with the provided garment. Keep the person's face, pose, and background identical. High resolution, sharp detail. Return ONLY the final image.";
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
    const prompt = `Fashion photography: Change the pose to "${poseInstruction}". Keep person, clothes, and background identical. Extremely realistic. Return ONLY the image.`;
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [tryOnImagePart, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
    });
    return handleApiResponse(response);
};


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getApiKey = () => {
    let key = '';
    
    // 1. Check Vite standard (Build-time injection for Netlify/Vercel)
    try {
        const env = (import.meta as any).env;
        if (env) {
            key = env.VITE_API_KEY || env.API_KEY || '';
        }
    } catch (e) {}

    // 2. Check Process environment (Runtime fallback)
    if (!key || key === 'undefined') {
        try {
            key = (process.env as any).VITE_API_KEY || (process.env as any).API_KEY || '';
        } catch (e) {}
    }

    // 3. Final sanitization
    const sanitizedKey = key?.trim();
    
    if (!sanitizedKey || sanitizedKey === 'undefined' || sanitizedKey === '') {
        throw new Error("MISSING_API_KEY_SETUP");
    }
    
    return sanitizedKey;
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
    
    throw new Error("AI returned no image. Ensure images are clear and well-lit.");
};

const model = 'gemini-2.5-flash-image';

export const generateModelImage = async (userImage: File): Promise<string> => {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    const userImagePart = await fileToPart(userImage);
    const prompt = "PROFESSIONAL PERSONA TRANSFORMATION: Take this person and place them in a high-end fashion studio setting. Use professional commercial lighting, a clean minimalist background, and 8k photorealistic quality. Keep their core facial features identical but professionalized for a model portfolio. Return ONLY the final professional image.";
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [userImagePart, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
    });
    return handleApiResponse(response);
};

export const generateVirtualTryOnImage = async (modelImageUrl: string, garmentImage: File): Promise<string> => {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    const modelImagePart = dataUrlToPart(modelImageUrl);
    const garmentImagePart = await fileToPart(garmentImage);
    
    // MAXIMUM FIDELITY PROMPT
    const prompt = `EXACT CLOTH INTEGRATION: Fit the garment from the second image onto the model from the first image. 
    CRITICAL INSTRUCTION: You MUST maintain the EXACT pattern, color, brand logos, and texture of the cloth provided in the second image. DO NOT genericize the garment. 
    Ensure realistic physics, wrinkles, and shadows based on the model's pose. The model's identity and background must remain UNCHANGED.
    Return ONLY the final high-resolution image.`;

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [modelImagePart, garmentImagePart, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
    });
    return handleApiResponse(response);
};

export const generatePoseVariation = async (tryOnImageUrl: string, poseInstruction: string): Promise<string> => {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    const tryOnImagePart = dataUrlToPart(tryOnImageUrl);
    const prompt = `STANCE VARIATION: Update the model's stance to: "${poseInstruction}". You must preserve the model's identity and the EXACT fabric details of the clothing. The lighting and studio background must stay consistent. Return ONLY the final image.`;
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [tryOnImagePart, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
    });
    return handleApiResponse(response);
};

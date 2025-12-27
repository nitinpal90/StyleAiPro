/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Robust API key detection for Vite applications.
 */
const getApiKey = (): string => {
    const key = (import.meta as any).env?.VITE_GOOGLE_API_KEY;
    
    if (key && key !== 'undefined') {
        return key;
    }

    console.error("Setup Error: API key not detected. Please configure VITE_GOOGLE_API_KEY.");
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
    
    throw new Error("AI returned no image output. The image might have been flagged by safety filters.");
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

    const prompt = "PROFESSIONAL PERSONA TRANSFORMATION: Convert this person into a high-end fashion studio portrait. 8k resolution, professional studio lighting. Preserve facial features perfectly. Return ONLY the final image.";
    
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
    
    const prompt = `EXACT CLOTH INTEGRATION: Fit the garment from the second image onto the person in the first image. Preserve patterns and colors exactly. Return ONLY the final high-resolution image.`;

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
    
    const prompt = `STANCE VARIATION: Update the person's pose to: "${poseInstruction}". Keep identity and clothes identical. Return ONLY the final image.`;
    
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: [tryOnImagePart, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
    });
    
    return handleApiResponse(response);
};
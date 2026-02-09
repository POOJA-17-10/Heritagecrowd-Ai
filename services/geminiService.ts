
import { GoogleGenAI, Type } from "@google/genai";
import { CrowdLevel, TimeSlotPrediction } from "../types";

// Always initialize the client using the exact named parameter from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function predictCrowdLevels(siteName: string): Promise<TimeSlotPrediction[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Predict the crowd levels for ${siteName} heritage site for 5 time slots: 08-10, 10-12, 12-14, 14-16, 16-18. Return the response as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              slot: { type: Type.STRING },
              crowdLevel: { type: Type.STRING, enum: Object.values(CrowdLevel) },
              recommendation: { type: Type.STRING }
            },
            required: ["slot", "crowdLevel", "recommendation"]
          }
        }
      }
    });

    // Access the text property directly on the response object
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    // Fallback data if API fails or key is missing
    return [
      { slot: '08:00 AM - 10:00 AM', crowdLevel: CrowdLevel.LOW, recommendation: 'Excellent time to visit' },
      { slot: '10:00 AM - 12:00 PM', crowdLevel: CrowdLevel.MEDIUM, recommendation: 'Moderately busy' },
      { slot: '12:00 PM - 02:00 PM', crowdLevel: CrowdLevel.HIGH, recommendation: 'Peak hours, expect queues' },
      { slot: '02:00 PM - 04:00 PM', crowdLevel: CrowdLevel.HIGH, recommendation: 'Peak hours, expect queues' },
      { slot: '04:00 PM - 06:00 PM', crowdLevel: CrowdLevel.MEDIUM, recommendation: 'Crowds start thinning' },
    ];
  }
}

import { GoogleGenAI, Type } from "@google/genai";
import type { BookingDetails, SmsExplanation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    introduction: { type: Type.STRING },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepTitle: { type: Type.STRING },
          stepDescription: { type: Type.STRING },
        },
        required: ['stepTitle', 'stepDescription']
      }
    },
    fileTree: {
      type: Type.ARRAY,
      description: "A visual representation of the project folder structure.",
      items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            type: { type: Type.STRING, description: "Should be 'folder' or 'file'" },
            level: { type: Type.INTEGER, description: "Indentation level, starting from 0 for the root" },
        },
        required: ['name', 'type', 'level']
      }
    },
    codeSnippet: {
      type: Type.OBJECT,
      properties: {
        language: { type: Type.STRING },
        code: { type: Type.STRING },
        description: { type: Type.STRING }
      },
      required: ['language', 'code', 'description']
    },
    conclusion: { type: Type.STRING }
  },
  required: ['title', 'introduction', 'steps', 'fileTree', 'codeSnippet', 'conclusion']
};

export const generateSmsNotificationExplanation = async (bookingDetails: BookingDetails): Promise<SmsExplanation> => {
  const prompt = `
    The user is the owner of a house cleaning service called "Sparkle Clean".
    A customer has just submitted a booking request with the following details:
    - Name: ${bookingDetails.name}
    - Phone: ${bookingDetails.phone}
    - Service: ${bookingDetails.serviceType} clean for ${bookingDetails.bedrooms} bed, ${bookingDetails.bathrooms} bath
    - Address: ${bookingDetails.address}
    - Date/Time: ${bookingDetails.date} at ${bookingDetails.time}

    Your task is to act as a helpful technical guide. Explain to the business owner how they can automatically receive an SMS notification for this new booking.
    
    The explanation should be clear, concise, and targeted at someone with basic technical knowledge.
    
    Structure your response according to the provided JSON schema.
    
    1.  **Title**: Create a clear and engaging title.
    2.  **Introduction**: Briefly explain the benefit of instant SMS notifications for their business.
    3.  **Steps**: Provide a step-by-step guide. The steps should cover:
        - Setting up a server-side environment (like Node.js with Express).
        - Choosing an SMS provider (like Twilio) and getting API keys.
        - Creating an API endpoint on their server that the booking form can call.
        - Writing the code to send the SMS.
    4.  **File Tree**: Create a simple file tree for a Node.js/Express project. Include a root folder, 'package.json', '.env', and a server file like 'index.js' or 'server.js'.
    5.  **Code Snippet**: Provide a complete, runnable Node.js/Express code example using a popular SMS service library (e.g., 'twilio'). The code should:
        - Be an Express server.
        - Have an endpoint (e.g., '/send-notification').
        - Read credentials and phone numbers from environment variables (.env file).
        - Construct a clear SMS message body containing the key booking details.
        - Send the SMS to the business owner's phone number.
        - Include comments explaining the code.
        - IMPORTANT: Use placeholder variables for sensitive info like API keys, Account SIDs, and phone numbers. For example: \`process.env.TWILIO_ACCOUNT_SID\`, \`process.env.OWNER_PHONE_NUMBER\`.
    6.  **Conclusion**: Summarize the solution and mention the next steps (deploying the server, integrating the endpoint with their website's booking form).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as SmsExplanation;

  } catch (error) {
    console.error("Error generating explanation:", error);
    throw new Error("Failed to generate SMS notification explanation from Gemini API.");
  }
};

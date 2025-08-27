import { GoogleGenAI, Type } from "@google/genai";
import type { BookingDetails, NotificationDetails } from '../types';
import { ServiceType } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function getServiceTypeName(serviceType: ServiceType): string {
    switch (serviceType) {
        case ServiceType.Standard: return 'Standard Cleaning';
        case ServiceType.Deep: return 'Deep Cleaning';
        case ServiceType.MoveInOut: return 'Move-In/Out Cleaning';
        default: return 'Unknown Service';
    }
}

export async function generateBookingNotification(details: BookingDetails): Promise<NotificationDetails> {
  const serviceTypeName = getServiceTypeName(details.serviceType);

  const prompt = `
    A new house cleaning appointment has been booked online for "Sparkle Clean".
    The booking details are provided below. Your task is to process these details and generate a structured JSON notification for the business owner.

    Booking Details:
    - Customer Name: ${details.name}
    - Customer Address: ${details.address}
    - Customer Phone: ${details.phone}
    - Service Type: ${serviceTypeName}
    - Appointment Date: ${details.date}
    - Appointment Time: ${details.time}
    - Additional Notes: ${details.notes || 'None provided'}
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      subject: { type: Type.STRING, description: `A short, clear subject line for the notification (e.g., 'New Cleaning Appointment: ${details.name}').` },
      summary: { type: Type.STRING, description: `A concise one-sentence summary of the booking (e.g., '${details.name} booked a ${serviceTypeName} for ${details.date} at ${details.time}.').` },
      details: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          address: { type: Type.STRING },
          phone: { type: Type.STRING },
          service: { type: Type.STRING },
          dateTime: { type: Type.STRING, description: "Combine the date and time into a single human-readable string (e.g., '2024-08-15 at 10:00 AM')." },
          notes: { type: Type.STRING },
        },
        required: ["name", "address", "phone", "service", "dateTime", "notes"],
      },
      suggestedAction: { type: Type.STRING, description: `A clear, actionable suggestion for the business owner (e.g., 'Contact ${details.name} at ${details.phone} to confirm the appointment.').` },
    },
    required: ["subject", "summary", "details", "suggestedAction"],
  };

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        },
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as NotificationDetails;

  } catch (error) {
    console.error("Error calling or parsing Gemini API response:", error);
    throw new Error("Could not generate notification from Gemini API.");
  }
}
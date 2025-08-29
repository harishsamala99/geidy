export const ServiceType = {
  Standard: 'standard',
  Deep: 'deep',
  MoveInOut: 'move-in-out',
} as const;

export type ServiceType = typeof ServiceType[keyof typeof ServiceType];

export interface BookingDetails {
  name: string;
  address: string;
  phone: string;
  serviceType: ServiceType;
  date: string;
  time: string;
  notes?: string;
}

export interface NotificationDetails {
  subject: string;
  summary: string;
  details: {
    name: string;
    address: string;
    phone: string;
    service: string;
    dateTime: string;
    notes: string;
  };
  suggestedAction: string;
}



// types.ts
export interface GeneratedNotifications {
  bookingId: string;        // unique booking ID (e.g., APT-001)
  customerPhone: string;    // customer's phone number (+1234567890 format)
  repPhone: string;         // representative's phone number
  message: string;          // full SMS body content
  date: string;            // optional appointment date
  time: string;            // optional appointment time
  service: string;         // optional service type
}

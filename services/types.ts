
export interface BookingDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  serviceType: 'standard' | 'deep' | 'move-in-out';
  bedrooms: number;
  bathrooms: number;
  date: string;
  time: string;
  instructions?: string;
}

export interface SmsExplanation {
  title: string;
  introduction: string;
  steps: {
    stepTitle: string;
    stepDescription: string;
  }[];
  fileTree?: {
    name: string;
    type: 'folder' | 'file';
    level: number;
  }[];
  codeSnippet: {
    language: string;
    code: string;
    description: string;
  };
  conclusion: string;
}

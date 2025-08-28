import React, { useState } from 'react';
import type { BookingDetails } from '../types'; // ✅ Import BookingDetails

interface BookingFormProps {
  onSubmit: (details: BookingDetails) => void;
  isLoading: boolean;
  isBooked: boolean;
}


const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, isLoading, isBooked }) => {
  const [formData, setFormData] = useState<BookingDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    serviceType: 'standard',
    bedrooms: 2,
    bathrooms: 1,
    date: '',
    time: '09:00',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (isBooked) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center border-2 border-green-500">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckIcon className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-slate-800">Booking Confirmed!</h3>
        <p className="mt-2 text-slate-600">
          Thank you for choosing Sparkle Clean. We've received your request. Our team will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">Get a Free Estimate</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Full Name" required className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" onChange={handleChange} value={formData.name} />
        <input type="tel" name="phone" placeholder="Phone Number" required className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" onChange={handleChange} value={formData.phone} />
        <input type="email" name="email" placeholder="Email Address" required className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" onChange={handleChange} value={formData.email} />
        <input type="text" name="address" placeholder="Home Address" required className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" onChange={handleChange} value={formData.address} />

        <select name="serviceType" className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" onChange={handleChange} value={formData.serviceType}>
          <option value="standard">Standard Clean</option>
          <option value="deep">Deep Clean</option>
          <option value="move-in-out">Move-in/out Clean</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Bedrooms</label>
            <input type="number" name="bedrooms" min="1" max="10" required className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" onChange={handleChange} value={formData.bedrooms} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Bathrooms</label>
            <input type="number" name="bathrooms" min="1" max="10" required className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" onChange={handleChange} value={formData.bathrooms} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="date" name="date" required className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" onChange={handleChange} value={formData.date} />
          <input type="time" name="time" required className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" onChange={handleChange} value={formData.time} />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold p-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Booking & Generating Guide...
            </>
          ) : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;

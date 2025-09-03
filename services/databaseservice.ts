// --- TYPE DEFINITIONS ---
type BookingStatus = 'Pending' | 'Approved' | 'Rejected';

interface Booking {
  id: number;
  bookingNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
}

const DB_URL = 'http://localhost:4000';

// --- BOOKINGS API ---

export const getAllBookings = async (): Promise<Booking[]> => {
  const res = await fetch(`${DB_URL}/bookings`);
  return await res.json();
};

export const getBookingByNumber = async (
  bookingNumber: string
): Promise<Booking | null> => {
  const bookings = await getAllBookings();
  return (
    bookings.find(
      (b) => b.bookingNumber.toLowerCase() === bookingNumber.toLowerCase()
    ) || null
  );
};

export const createBooking = async (
  bookingData: Omit<Booking, 'id' | 'status' | 'bookingNumber'>
): Promise<Booking> => {
  const newBooking: Booking = {
    ...bookingData,
    id: Date.now(),
    bookingNumber: `SPK${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    status: 'Pending',
  };

  const res = await fetch(`${DB_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBooking),
  });

  return await res.json();
};

export const updateBookingStatus = async (
  bookingId: number,
  status: BookingStatus
): Promise<Booking | null> => {
  const res = await fetch(`${DB_URL}/bookings/${bookingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) return null;
  return await res.json();
};

export const deleteBooking = async (bookingId: number): Promise<boolean> => {
  const res = await fetch(`${DB_URL}/bookings/${bookingId}`, {
    method: 'DELETE',
  });
  return res.ok;
};

// --- PASSWORDS API ---

export const getPasswords = async (): Promise<string[]> => {
  const res = await fetch(`${DB_URL}/adminPasswords`);
  return await res.json();
};

export const addPassword = async (password: string): Promise<boolean> => {
  const passwords = await getPasswords();
  if (!password || passwords.includes(password)) return false;

  const res = await fetch(`${DB_URL}/adminPasswords`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(password),
  });

  return res.ok;
};

export const deletePassword = async (
  passwordToDelete: string
): Promise<boolean> => {
  const passwords = await getPasswords();
  const index = passwords.indexOf(passwordToDelete);
  if (index === -1 || passwords.length <= 1) return false;

  // JSON Server stores passwords as an array, not objects with IDs.
  // So we overwrite the whole array instead of deleting one by ID.
  const updatedPasswords = passwords.filter((p) => p !== passwordToDelete);

  const res = await fetch(`${DB_URL}/adminPasswords`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPasswords),
  });

  return res.ok;
};

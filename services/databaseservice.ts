// src/services/databaseservice.ts
const API_BASE = "http://localhost:8080/api";

// ----------------- Booking Interfaces -----------------
export interface Booking {
  id: number | string;
  customerName: string;
  date: string;
  status: string;
  [key: string]: any; // for any extra fields
}

// Get all bookings
export async function getAllBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/bookings`);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

// Get a single booking by ID
export async function getBookingById(bookingId: number | string): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}`);
  if (!res.ok) throw new Error("Booking not found");
  return res.json();
}

// Create a new booking
export async function createBooking(data: Booking): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create booking");
  return res.json();
}

// Update booking by ID
export async function updateBooking(bookingId: number | string, data: Partial<Booking>): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update booking");
  return res.json();
}

// Delete booking by ID
export async function deleteBooking(bookingId: number | string): Promise<any> {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete booking");
  return res.json();
}

// ----------------- Password Interfaces -----------------
export interface Password {
  id: number | string;
  username: string;
  password: string;
  [key: string]: any; // for any extra fields
}

// Get all passwords
export async function getPasswords(): Promise<Password[]> {
  const res = await fetch(`${API_BASE}/passwords`);
  if (!res.ok) throw new Error("Failed to fetch passwords");
  return res.json();
}

// Add a new password
export async function addPassword(data: Password): Promise<Password> {
  const res = await fetch(`${API_BASE}/passwords`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add password");
  return res.json();
}

// Delete a password by ID
export async function deletePassword(passwordId: number | string): Promise<any> {
  const res = await fetch(`${API_BASE}/passwords/${passwordId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete password");
  return res.json();
}

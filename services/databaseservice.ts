// --- TYPE DEFINITIONS (mirrored from App.tsx for service independence) ---
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

interface AppDatabase {
    bookings: Booking[];
    adminPasswords: string[];
}


// --- DATABASE CONFIGURATION ---

// IMPORTANT: This service uses a free public JSON store (npoint.io) to simulate a
// real database. This is for demonstration purposes only to allow data sharing
// across devices without a proper backend.
//
// In a production environment, you MUST use a secure, private database.
// The data at this URL is public and can be overwritten by anyone.
const DB_URL = 'https://api.npoint.io/0821880993a43bf4c735';

const getInitialData = (): AppDatabase => ({
    bookings: [],
    adminPasswords: ['admin123', 'sparkle_admin_789', 'top_secret_pass'],
});


// --- CORE DB HELPER FUNCTIONS ---

async function fetchDb(): Promise<AppDatabase> {
    try {
        const response = await fetch(DB_URL);
        if (response.ok) {
            const data = await response.json();
            // Basic validation to ensure the fetched data has the expected structure
            if (data && Array.isArray(data.bookings) && Array.isArray(data.adminPasswords)) {
                return data as AppDatabase;
            }
        }
        // If response is not ok, or data is malformed, return initial data
        console.warn('Database is empty or corrupt, initializing with default data.');
        const initialData = getInitialData();
        await updateDb(initialData);
        return initialData;
    } catch (error) {
        console.error('Failed to fetch from DB, using initial data:', error);
        const initialData = getInitialData();
        await updateDb(initialData);
        return initialData;
    }
}

async function updateDb(data: AppDatabase): Promise<void> {
    try {
        const response = await fetch(DB_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`DB update failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Failed to update DB:', error);
        // In a real app, you'd want more robust error handling.
    }
}


// --- PUBLIC API: BOOKINGS ---

export const getAllBookings = async (): Promise<Booking[]> => {
    const db = await fetchDb();
    return db.bookings;
};

export const getBookingByNumber = async (bookingNumber: string): Promise<Booking | null> => {
    const db = await fetchDb();
    return db.bookings.find(b => b.bookingNumber.toLowerCase() === bookingNumber.toLowerCase()) || null;
};

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'status' | 'bookingNumber'>): Promise<Booking> => {
    const db = await fetchDb();
    const newBooking: Booking = {
      ...bookingData,
      id: db.bookings.length > 0 ? Math.max(...db.bookings.map(b => b.id)) + 1 : 1,
      bookingNumber: `SPK${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: 'Pending',
    };
    db.bookings.push(newBooking);
    await updateDb(db);
    return newBooking;
};

export const updateBookingStatus = async (bookingId: number, status: BookingStatus): Promise<Booking | null> => {
    const db = await fetchDb();
    const bookingIndex = db.bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex > -1) {
        db.bookings[bookingIndex].status = status;
        await updateDb(db);
        return db.bookings[bookingIndex];
    }
    return null;
};

export const deleteBooking = async (bookingId: number): Promise<boolean> => {
    const db = await fetchDb();
    const initialLength = db.bookings.length;
    db.bookings = db.bookings.filter(b => b.id !== bookingId);
    const wasDeleted = db.bookings.length < initialLength;
    if (wasDeleted) {
        await updateDb(db);
    }
    return wasDeleted;
};


// --- PUBLIC API: PASSWORDS ---

export const getPasswords = async (): Promise<string[]> => {
    const db = await fetchDb();
    // Ensure there's at least one password
    if (db.adminPasswords.length === 0) {
        const initialData = getInitialData();
        await updateDb(initialData);
        return initialData.adminPasswords;
    }
    return db.adminPasswords;
}

export const addPassword = async (password: string): Promise<boolean> => {
    const db = await fetchDb();
    if (!password || db.adminPasswords.includes(password)) {
        return false;
    }
    db.adminPasswords.push(password);
    await updateDb(db);
    return true;
}

export const deletePassword = async (passwordToDelete: string): Promise<boolean> => {
    const db = await fetchDb();
    if (db.adminPasswords.length <= 1) {
        return false; // Prevent deleting the last password
    }
    db.adminPasswords = db.adminPasswords.filter(p => p !== passwordToDelete);
    await updateDb(db);
    return true;
}

import React, { useState, useEffect, FormEvent, ReactNode } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

// --- TYPE DEFINITIONS ---
interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface Cleaner {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  contact: string;
}

interface Booking {
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  date: string;
  time: string;
}

// --- ICONS (as components) ---

const SparkleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const DeepCleanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M4 17v4m-2-2h4m1-15l4.286 4.286-1.06 1.06-4.286-4.286a2 2 0 012.828-2.828l4.286 4.286L20 4M6 18l4.286-4.286-1.06-1.06L5 16.94a2 2 0 002.828 2.828l4.286-4.286L20 20" />
  </svg>
);

const CarpetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 12h16M4 16h16" />
  </svg>
);

const KitchenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0h-2M7 9H5m12 0a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2m12 0v-2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6" />
  </svg>
);

const BathroomIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22a10 10 0 110-20 10 10 0 010 20zm0-18v.01M12 8a4 4 0 00-4 4h8a4 4 0 00-4-4zm0 6a2 2 0 110 4 2 2 0 010-4z" />
  </svg>
);

const WindowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4zm0 8h16M12 4v16" />
    </svg>
);

const OfficeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4a2 2 0 012-2h10a2 2 0 012 2v4M8 11V9a4 4 0 118 0v2" />
    </svg>
);

// --- CONSTANTS (Data) ---

const SERVICES_DATA: Service[] = [
  { id: 'deep-cleaning', title: 'Deep Cleaning', description: 'A thorough cleaning of your entire home, top to bottom. Perfect for spring cleaning or moving.', price: '$250+', icon: DeepCleanIcon },
  { id: 'carpet-cleaning', title: 'Carpet Cleaning', description: 'Professional steam cleaning to remove stains, dirt, and allergens from your carpets.', price: '$120+', icon: CarpetIcon },
  { id: 'kitchen-cleaning', title: 'Kitchen Cleaning', description: 'We sanitize all surfaces, clean appliances, and make your kitchen sparkle like new.', price: '$80+', icon: KitchenIcon },
  { id: 'bathroom-cleaning', title: 'Bathroom Cleaning', description: 'A complete disinfection and cleaning of showers, tubs, toilets, and sinks.', price: '$70+', icon: BathroomIcon },
  { id: 'window-cleaning', title: 'Window Cleaning', description: 'Streak-free cleaning for all interior and exterior windows, letting the sunshine in.', price: '$90+', icon: WindowIcon },
  { id: 'office-cleaning', title: 'Office Cleaning', description: 'Customized cleaning plans for commercial spaces to ensure a healthy work environment.', price: 'Contact Us', icon: OfficeIcon },
];

const House_Cleaner: Cleaner = {
  name: "Geidy Cabrera",
  role: "Founder & Head Cleaner",
  bio: "With over 15 years of experience, Geidy founded SparkleClean with a passion for creating pristine and healthy living spaces for her clients.",
  imageUrl:"https://picsum.photos/id/1027/400/400",
  contact: "203-424-9033",
};


// --- UI / HELPER COMPONENTS ---

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const PageWrapper: React.FC<{ children: ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 animate-fadeIn ${className}`}>
        {children}
    </div>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navLinks = [
    { path: '/', name: 'Home' },
    { path: '/services', name: 'Services' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
  ];
  
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center text-2xl font-bold text-sky-600">
            <SparkleIcon className="h-8 w-8 text-sky-500 mr-2" />
            SparkleClean
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <NavLink key={link.name} to={link.path} className={({ isActive }) => 
                `text-gray-600 hover:text-sky-600 transition duration-300 ${isActive ? 'text-sky-600 font-semibold' : ''}`
              }>
                {link.name}
              </NavLink>
            ))}
            <Link to="/booking" className="bg-sky-500 text-white px-5 py-2 rounded-full hover:bg-sky-600 transition duration-300 shadow-sm">
              Book Now
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-sky-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map(link => (
              <NavLink key={link.name} to={link.path} className={({ isActive }) => 
                `block py-2 px-4 text-sm ${isActive ? 'bg-sky-100 text-sky-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`
              }>
                {link.name}
              </NavLink>
            ))}
            <Link to="/booking" className="block text-center bg-sky-500 text-white mt-4 px-5 py-2 rounded-full hover:bg-sky-600 transition duration-300 shadow-sm">
              Book Now
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

const Footer = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; {new Date().getFullYear()} SparkleClean. All Rights Reserved.</p>
            <div className="flex justify-center items-center space-x-4 mt-4">
                <a href="#" className="hover:text-sky-400">Facebook</a>
                <a href="#" className="hover:text-sky-400">Twitter</a>
                <a href="#" className="hover:text-sky-400">Instagram</a>
                <span className="text-gray-500 hidden sm:inline">|</span>
                <Link to="/admin/bookings" className="hover:text-sky-400">View Bookings</Link>
            </div>
        </div>
    </footer>
);


// --- PAGE COMPONENTS ---

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div>
            {/* Hero Section */}
            <div className="bg-sky-100 text-center py-20 md:py-32">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800">Pristine Clean for a Sparkling Home</h1>
                <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-2xl mx-auto">Reliable, professional, and thorough cleaning services tailored to your needs.</p>
                <button onClick={() => navigate('/booking')} className="mt-8 bg-sky-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-sky-600 transition duration-300 shadow-lg transform hover:scale-105">
                    Book Now
                </button>
            </div>
            {/* Services Highlight */}
            <PageWrapper>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SERVICES_DATA.slice(0, 6).map(service => (
                        <div key={service.id} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
                            <div className="flex justify-center items-center mb-4 text-sky-500">
                                <service.icon className="h-12 w-12" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{service.title}</h3>
                            <p className="text-gray-600">{service.description.substring(0, 80)}...</p>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <Link to="/services" className="text-sky-600 font-semibold hover:underline">View All Services &rarr;</Link>
                </div>
            </PageWrapper>
        </div>
    );
};

const AboutPage = () => (
  <PageWrapper>
    <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">About SparkleClean</h1>
    <div className="text-center max-w-3xl mx-auto text-gray-600 text-lg mb-16">
      <p>Founded on the principle that a clean home is a happy home, SparkleClean has been dedicated to providing top-tier residential and commercial cleaning services for over a decade. Our mission is to create pristine environments that allow our clients to focus on what matters most to them. We believe in trust, reliability, and a little bit of sparkle.</p>
    </div>

    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet Our Cleaner</h2>
    <div className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
      <img
        src={House_Cleaner.imageUrl}
        alt={House_Cleaner.name}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-sky-100"
      />
      <h3 className="text-xl font-semibold text-gray-800">{House_Cleaner.name}</h3>
      <p className="text-sky-600 font-medium mb-2">{House_Cleaner.role}</p>
      <p className="text-gray-600 text-sm">{House_Cleaner.bio}</p>
      <p className="mt-3 text-gray-700">📞 {House_Cleaner.contact}</p>
    </div>
  </PageWrapper>
);


const ServicesPage = () => {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Cleaning Services</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {SERVICES_DATA.map(service => (
                    <div key={service.id} className="bg-white p-8 rounded-lg shadow-md flex flex-col">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-sky-100 rounded-full mr-4 text-sky-500">
                                <service.icon className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{service.title}</h3>
                                <p className="text-lg font-semibold text-sky-600">{service.price}</p>
                            </div>
                        </div>
                        <p className="text-gray-600 flex-grow mb-6">{service.description}</p>
                        <button onClick={() => navigate(`/booking?service=${service.id}`)} className="mt-auto bg-sky-500 text-white px-6 py-2 rounded-full hover:bg-sky-600 transition duration-300 self-start">
                            Book This Service
                        </button>
                    </div>
                ))}
            </div>
        </PageWrapper>
    );
};

const BookingPage = () => {
    const [formData, setFormData] = useState<Booking>({ name: '', email: '', phone: '', address: '', service: '', date: '', time: '' });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { search } = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(search);
        const serviceId = params.get('service');
        if (serviceId) {
            setFormData(prev => ({ ...prev, service: serviceId }));
        }
    }, [search]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate an API call and save to localStorage
        setTimeout(() => {
            console.log("Form data submitted:", formData);
            
            try {
                const existingBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
                const newBookings = [...existingBookings, formData];
                localStorage.setItem('bookings', JSON.stringify(newBookings));
            } catch (error) {
                console.error("Failed to save booking to localStorage", error);
            }

            setSubmitted(true);
            setIsSubmitting(false);
        }, 1000);
    };

    if (submitted) {
        return (
            <PageWrapper className="text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
                <p className="text-gray-700">Thank you, {formData.name}. We have received your request and will contact you shortly to confirm the details.</p>
                <Link to="/" className="mt-8 inline-block bg-sky-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-sky-600 transition duration-300">
                    Back to Home
                </Link>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Book Your Cleaning</h1>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" onChange={handleChange} value={formData.name} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" onChange={handleChange} value={formData.email} />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" name="phone" id="phone" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" onChange={handleChange} value={formData.phone} />
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" name="address" id="address" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" onChange={handleChange} value={formData.address} />
                    </div>
                     <div>
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700">Select Service</label>
                        <select name="service" id="service" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" onChange={handleChange} value={formData.service}>
                            <option value="">-- Please choose a service --</option>
                            {SERVICES_DATA.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date</label>
                            <input type="date" name="date" id="date" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" onChange={handleChange} value={formData.date} />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">Preferred Time</label>
                            <input type="time" name="time" id="time" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" onChange={handleChange} value={formData.time} />
                        </div>
                    </div>
                    <div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-sky-500 text-white py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                        </button>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
};

const ContactPage = () => {
    const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContactData({ ...contactData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            console.log("Contact form submitted:", contactData);
            setSubmitted(true);
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <PageWrapper>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Contact Us</h1>
            <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-xl">
                 {submitted ? (
                     <div className="text-center h-full flex flex-col justify-center py-10">
                        <h2 className="text-3xl font-bold text-green-600">Message Sent!</h2>
                        <p className="mt-4 text-gray-600">Thank you for contacting us, {contactData.name}. We will get back to you soon.</p>
                     </div>
                 ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <p className="text-center text-gray-600">Have questions? We'd love to hear from you. Fill out the form below.</p>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" onChange={handleChange} value={contactData.name} />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" onChange={handleChange} value={contactData.email} />
                        </div>
                         <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea name="message" id="message" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" onChange={handleChange} value={contactData.message}></textarea>
                        </div>
                         <div>
                            <button type="submit" disabled={isSubmitting} className="w-full bg-sky-500 text-white py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                 )}
            </div>
        </PageWrapper>
    );
};

const AdminBookingsPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        try {
            const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            setBookings(storedBookings);
        } catch (error) {
            console.error("Failed to load bookings from localStorage", error);
            setBookings([]);
        }
    }, []);

    return (
        <PageWrapper>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Customer Bookings</h1>
            {bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookings.map((booking, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-sky-600 mb-2">{booking.name}</h3>
                            <p className="text-gray-700 font-semibold">{SERVICES_DATA.find(s => s.id === booking.service)?.title || 'Unknown Service'}</p>
                            <hr className="my-4" />
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><span className="font-medium">Email:</span> {booking.email}</p>
                                <p><span className="font-medium">Phone:</span> {booking.phone}</p>
                                <p><span className="font-medium">Address:</span> {booking.address}</p>
                                <p><span className="font-medium">Date:</span> {booking.date}</p>
                                <p><span className="font-medium">Time:</span> {booking.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600 text-lg">No bookings have been made yet.</p>
            )}
        </PageWrapper>
    );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

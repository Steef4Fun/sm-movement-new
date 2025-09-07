import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "An unknown error occurred" }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    // Handle responses with no content (e.g., 204)
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (error: any) {
    console.error(`API request failed: ${error.message}`);
    toast.error(error.message);
    throw error;
  }
}

// --- Auth ---
export const loginUser = (credentials: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
export const registerUser = (userData: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });

// --- User Profile ---
export const getProfile = () => request('/users/profile');
export const updateProfile = (profileData: any) => request('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) });

// --- Admin: Users ---
export const getAllUsers = () => request('/users');
export const getUserById = (userId: string) => request(`/users/${userId}`);
export const updateUserRole = (userId: string, role: string) => request(`/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
export const deleteUser = (userId: string) => request(`/users/${userId}`, { method: 'DELETE' });

// --- Listings ---
export const getListings = () => request('/listings');
export const getListingById = (id: string) => request(`/listings/${id}`);
export const createListing = (listingData: any) => request('/listings', { method: 'POST', body: JSON.stringify(listingData) });
export const updateListing = (id: string, listingData: any) => request(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(listingData) });
export const deleteListing = (id: string) => request(`/listings/${id}`, { method: 'DELETE' });

// --- Appointments ---
export const getAppointments = () => request('/appointments');
export const createAppointment = (appointmentData: any) => request('/appointments', { method: 'POST', body: JSON.stringify(appointmentData) });
export const updateAppointment = (id: string, appointmentData: any) => request(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(appointmentData) });
export const deleteAppointment = (id: string) => request(`/appointments/${id}`, { method: 'DELETE' });

// --- Quotes ---
export const getQuotes = () => request('/quotes');
export const createQuote = (quoteData: any) => request('/quotes', { method: 'POST', body: JSON.stringify(quoteData) });
export const updateQuote = (id: string, quoteData: any) => request(`/quotes/${id}`, { method: 'PUT', body: JSON.stringify(quoteData) });
export const updateUserQuoteStatus = (id: string, status: string) => request(`/quotes/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const deleteQuote = (id: string) => request(`/quotes/${id}`, { method: 'DELETE' });
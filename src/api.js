import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Fetch list of properties with optional filter criteria
 * @param {Object} params - { search, type, minPrice, maxPrice, bedrooms, status, sort }
 */
export const getProperties = async (params = {}) => {
  const response = await api.get('/properties', { params });
  return response.data;
};

/**
 * Fetch single property details by ID
 * @param {string|number} id
 */
export const getPropertyById = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

/**
 * Create a new property listing
 * @param {Object} propertyData
 */
export const createProperty = async (propertyData) => {
  const response = await api.post('/properties', propertyData);
  return response.data;
};

/**
 * Fetch all customer inquiries
 */
export const getInquiries = async () => {
  const response = await api.get('/inquiries');
  return response.data;
};

/**
 * Submit a customer inquiry for a property
 * @param {Object} inquiryData - { property_id, customer_name, customer_email, customer_phone, message, preferred_contact, schedule_tour }
 */
export const createInquiry = async (inquiryData) => {
  const response = await api.post('/inquiries', inquiryData);
  return response.data;
};

/**
 * Update the status of an existing inquiry
 * @param {number} id
 * @param {string} status
 */
export const updateInquiryStatus = async (id, status) => {
  const response = await api.patch(`/inquiries/${id}/status`, { status });
  return response.data;
};

/**
 * Get overall system statistics
 */
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getAdminProperties = async (params = {}) => {
  const response = await api.get('/admin/properties', { params });
  return response.data;
};

export const createAdminProperty = async (property) => {
  const response = await api.post('/admin/properties', property);
  return response.data;
};

export const updateAdminProperty = async (id, property) => {
  const response = await api.put(`/admin/properties/${id}`, property);
  return response.data;
};

export const deleteAdminProperty = async (id) => {
  await api.delete(`/admin/properties/${id}`);
};

export const uploadAdminPropertyImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/admin/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getAdminInquiries = async (params = {}) => {
  const response = await api.get('/admin/inquiries', { params });
  return response.data;
};

export const updateAdminInquiryStatus = async (id, status) => {
  const response = await api.patch(`/admin/inquiries/${id}/status`, { status });
  return response.data;
};

export const deleteAdminInquiry = async (id) => {
  await api.delete(`/admin/inquiries/${id}`);
};

export default api;

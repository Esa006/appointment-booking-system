import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Centralized response interceptor for clean error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let formattedError = {
      status: error.response?.status || 500,
      code: error.response?.data?.code || 'SERVER_ERROR',
      message: error.response?.data?.message || 'An unexpected error occurred. Please try again.',
      errors: error.response?.data?.errors || null,
    };

    if (error.response?.status === 409) {
      formattedError.message = error.response.data?.message || 'This slot was just booked by another user. Please select an alternate time.';
      formattedError.code = error.response.data?.code || 'SLOT_ALREADY_BOOKED';
    } else if (error.response?.status === 422) {
      formattedError.code = 'VALIDATION_ERROR';
    } else if (error.response?.status === 404) {
      formattedError.code = 'NOT_FOUND';
    }

    return Promise.reject(formattedError);
  }
);

export const slotService = {
  getSlotsByDate: (dateString) => apiClient.get(`/slots?date=${dateString}`),
};

export const appointmentService = {
  bookAppointment: (data) => apiClient.post('/appointments', data),
  getAppointmentsByEmail: (email) => apiClient.get(`/appointments?email=${encodeURIComponent(email)}`),
  cancelAppointment: (id, cancellationReason) => 
    apiClient.patch(`/appointments/${id}/cancel`, { cancellation_reason: cancellationReason }),
};

export default apiClient;

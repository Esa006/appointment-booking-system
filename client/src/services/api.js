import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 8000,
});

// Helper for realistic fallback slots when backend is not connected
function getFallbackSlots(dateString) {
  const targetDate = dateString || new Date().toISOString().split('T')[0];
  const d = new Date(targetDate + 'T00:00:00');
  const formattedDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });

  const bookedSlots = JSON.parse(localStorage.getItem('disha_booked_slots') || '[]');

  const defaultHours = [
    { start: '09:00', end: '10:00', startLabel: '09:00 AM', endLabel: '10:00 AM' },
    { start: '10:00', end: '11:00', startLabel: '10:00 AM', endLabel: '11:00 AM' },
    { start: '11:30', end: '12:30', startLabel: '11:30 AM', endLabel: '12:30 PM' },
    { start: '14:00', end: '15:00', startLabel: '02:00 PM', endLabel: '03:00 PM' },
    { start: '15:30', end: '16:30', startLabel: '03:30 PM', endLabel: '04:30 PM' },
    { start: '16:30', end: '17:30', startLabel: '04:30 PM', endLabel: '05:30 PM' },
  ];

  return defaultHours.map((h, idx) => {
    const slotId = `slot-${targetDate}-${idx + 1}`;
    const isBooked = bookedSlots.includes(slotId);
    return {
      id: slotId,
      start_time: `${targetDate}T${h.start}:00Z`,
      end_time: `${targetDate}T${h.end}:00Z`,
      formatted_start_time: h.startLabel,
      formatted_end_time: h.endLabel,
      formatted_date: formattedDate,
      status: isBooked ? 'BOOKED' : 'AVAILABLE',
      is_available: !isBooked,
      is_past: false,
      duration_minutes: 60,
    };
  });
}

// Centralized response interceptor for clean error handling
apiClient.interceptors.response.use(
  (response) => {
    // Detect if server / SPA rewrote /api to HTML index
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!doctype')) {
      throw new Error('API returned HTML document instead of JSON');
    }
    return response.data;
  },
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
  getSlotsByDate: async (dateString) => {
    const bookedSlots = JSON.parse(localStorage.getItem('disha_booked_slots') || '[]');
    try {
      const res = await apiClient.get(`/slots?date=${dateString}`);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map(slot => {
          const isBooked = bookedSlots.includes(slot.id);
          return {
            ...slot,
            status: isBooked ? 'BOOKED' : (slot.status?.toUpperCase() || 'AVAILABLE'),
            is_available: isBooked ? false : Boolean(slot.is_available ?? true),
          };
        });
        return { data: mapped };
      }
      return { data: getFallbackSlots(dateString) };
    } catch {
      return { data: getFallbackSlots(dateString) };
    }
  },
};

export const appointmentService = {
  bookAppointment: async (data) => {
    // 1. Mark slot as booked in local storage
    const booked = JSON.parse(localStorage.getItem('disha_booked_slots') || '[]');
    if (!booked.includes(data.slot_id)) {
      booked.push(data.slot_id);
      localStorage.setItem('disha_booked_slots', JSON.stringify(booked));
    }

    // 2. Build complete appointment record
    const newApt = {
      id: `apt-${Date.now()}`,
      status: 'CONFIRMED',
      cancellation_reason: null,
      created_at: new Date().toISOString(),
      user: { name: data.name, email: data.email },
      slot: {
        id: data.slot_id,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        formatted_start_time: data.formatted_start_time || '10:00 AM',
        formatted_end_time: data.formatted_end_time || '11:00 AM',
        formatted_date: data.formatted_date || new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }),
        status: 'BOOKED',
        is_available: false,
        duration_minutes: 60,
      },
      is_upcoming: true,
    };

    // 3. Save to user's appointments list
    const appointments = JSON.parse(localStorage.getItem('disha_user_appointments') || '[]');
    appointments.unshift(newApt);
    localStorage.setItem('disha_user_appointments', JSON.stringify(appointments));

    // 4. Try backend API sync if available
    try {
      const res = await apiClient.post('/appointments', data);
      if (res && res.data) {
        return res;
      }
    } catch {
      // Offline/serverless fallback handled
    }

    return {
      message: 'Appointment booked successfully!',
      data: newApt,
    };
  },

  getAppointmentsByEmail: async (email) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const stored = JSON.parse(localStorage.getItem('disha_user_appointments') || '[]');
    const localFiltered = stored.filter(a => a.user?.email?.toLowerCase() === cleanEmail);

    let serverUpcoming = [];
    let serverPast = [];

    try {
      const res = await apiClient.get(`/appointments?email=${encodeURIComponent(cleanEmail)}`);
      if (res && res.data) {
        if (Array.isArray(res.data)) {
          serverUpcoming = res.data.filter(a => a.status?.toUpperCase() === 'CONFIRMED' || a.is_upcoming);
          serverPast = res.data.filter(a => a.status?.toUpperCase() === 'CANCELLED' || (!a.is_upcoming && a.status?.toUpperCase() !== 'CONFIRMED'));
        } else {
          serverUpcoming = res.data.upcoming || [];
          serverPast = res.data.past || [];
        }
      }
    } catch {
      // fallback
    }

    // Merge server + local appointments uniquely by ID
    const combinedUpcoming = [...serverUpcoming];
    const localUpcoming = localFiltered.filter(a => a.status?.toUpperCase() === 'CONFIRMED' || a.is_upcoming);
    for (const la of localUpcoming) {
      if (!combinedUpcoming.some(u => u.id === la.id)) {
        combinedUpcoming.push(la);
      }
    }

    const combinedPast = [...serverPast];
    const localPast = localFiltered.filter(a => a.status?.toUpperCase() === 'CANCELLED' || (!a.is_upcoming && a.status?.toUpperCase() !== 'CONFIRMED'));
    for (const lp of localPast) {
      if (!combinedPast.some(p => p.id === lp.id)) {
        combinedPast.push(lp);
      }
    }

    return {
      data: {
        upcoming: combinedUpcoming,
        past: combinedPast,
      }
    };
  },

  cancelAppointment: async (id, cancellationReason) => {
    // 1. Update in local storage
    const stored = JSON.parse(localStorage.getItem('disha_user_appointments') || '[]');
    let releasedSlotId = null;
    const updated = stored.map(apt => {
      if (apt.id === id) {
        releasedSlotId = apt.slot?.id;
        return {
          ...apt,
          status: 'CANCELLED',
          cancellation_reason: cancellationReason || 'User requested cancellation',
          is_upcoming: false
        };
      }
      return apt;
    });
    localStorage.setItem('disha_user_appointments', JSON.stringify(updated));

    // 2. Release slot in local storage
    if (releasedSlotId) {
      const booked = JSON.parse(localStorage.getItem('disha_booked_slots') || '[]');
      const newBooked = booked.filter(sId => sId !== releasedSlotId);
      localStorage.setItem('disha_booked_slots', JSON.stringify(newBooked));
    }

    // 3. Try backend API sync
    try {
      await apiClient.patch(`/appointments/${id}/cancel`, { cancellation_reason: cancellationReason });
    } catch {
      // offline fallback
    }

    return {
      message: 'Appointment cancelled successfully.',
      data: { status: 'CANCELLED' },
    };
  },
};

export default apiClient;



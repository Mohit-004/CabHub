const API_BASE = 'http://localhost:3000/api';

const getHeaders = (tokenOverride = null) => {
  const token = tokenOverride || localStorage.getItem('cabhub_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  try {
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'API request failed' };
    }
    return data;
  } catch (error) {
    return { success: false, message: 'Server communication error' };
  }
};

export const authAPI = {
  login: async (email, password, role) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await handleResponse(res);
      if (data.success && data.token) {
        localStorage.setItem('cabhub_token', data.token);
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Network error during login' };
    }
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await handleResponse(res);
      if (data.success && data.token) {
        localStorage.setItem('cabhub_token', data.token);
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Network error during registration' };
    }
  },

  getMe: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error getting current user' };
    }
  },
};

export const passengerAPI = {
  getDashboard: async () => {
    try {
      const res = await fetch(`${API_BASE}/passenger/dashboard`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const res = await fetch(`${API_BASE}/passenger/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  rechargeWallet: async (amount) => {
    try {
      const res = await fetch(`${API_BASE}/passenger/wallet/recharge`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ amount }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  requestRide: async (rideDetails) => {
    try {
      const res = await fetch(`${API_BASE}/passenger/ride/request`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(rideDetails),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error requesting ride' };
    }
  },

  getActiveRide: async () => {
    try {
      const res = await fetch(`${API_BASE}/passenger/ride/active`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  cancelRide: async () => {
    try {
      const res = await fetch(`${API_BASE}/passenger/ride/cancel`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  rateRide: async (rideId, stars, feedback, tip) => {
    try {
      const res = await fetch(`${API_BASE}/passenger/ride/rate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ rideId, stars, feedback, tip }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  sendRideMessage: async (rideId, text) => {
    try {
      const res = await fetch(`${API_BASE}/passenger/ride/message`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ rideId, text }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  triggerSOS: async (rideId) => {
    try {
      const res = await fetch(`${API_BASE}/passenger/ride/sos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ rideId }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  fileComplaint: async (rideId, description) => {
    try {
      const res = await fetch(`${API_BASE}/passenger/complaint`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ rideId, description }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  getComplaints: async () => {
    try {
      const res = await fetch(`${API_BASE}/passenger/complaints`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  estimateFare: async (fareParams) => {
    try {
      const res = await fetch(`${API_BASE}/passenger/ride/estimate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(fareParams),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error estimating fare' };
    }
  },
};

export const driverAPI = {
  getDashboard: async () => {
    try {
      const res = await fetch(`${API_BASE}/driver/dashboard`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  toggleDuty: async () => {
    try {
      const res = await fetch(`${API_BASE}/driver/duty/toggle`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  acceptRide: async (rideId) => {
    try {
      const res = await fetch(`${API_BASE}/driver/ride/accept`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ rideId }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  updateRideStatus: async (rideId, status, otp) => {
    try {
      const res = await fetch(`${API_BASE}/driver/ride/status`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ rideId, status, otp }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  updateLocation: async (latitude, longitude) => {
    try {
      const res = await fetch(`${API_BASE}/driver/location`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ latitude, longitude }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  sendRideMessage: async (rideId, text) => {
    try {
      const res = await fetch(`${API_BASE}/driver/ride/message`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ rideId, text }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  fileComplaint: async (rideId, description) => {
    try {
      const res = await fetch(`${API_BASE}/driver/complaint`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ rideId, description }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  getComplaints: async () => {
    try {
      const res = await fetch(`${API_BASE}/driver/complaints`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  uploadDocuments: async (formData) => {
    try {
      const token = localStorage.getItem('cabhub_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/driver/documents`, {
        method: 'POST',
        headers,
        body: formData,
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error uploading documents' };
    }
  },
};

export const adminAPI = {
  getStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard/stats`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  getUsers: async (search = '') => {
    try {
      const res = await fetch(`${API_BASE}/admin/users?search=${encodeURIComponent(search)}`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  toggleUserStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  getPendingDrivers: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/drivers/pending`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  getDriverDetails: async (driverId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/drivers/${driverId}`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  verifyDriver: async (driverId, status) => {
    try {
      const res = await fetch(`${API_BASE}/admin/drivers/verify`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ driverId, status }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  getComplaints: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/complaints`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  resolveComplaint: async (complaintId, resolution) => {
    try {
      const res = await fetch(`${API_BASE}/admin/complaints/resolve`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ complaintId, resolution }),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  getCoupons: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/coupons`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  createCoupon: async (couponData) => {
    try {
      const res = await fetch(`${API_BASE}/admin/coupons`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(couponData),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },
};

export const notificationAPI = {
  getNotifications: async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  markAsRead: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },
};

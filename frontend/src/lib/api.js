import { BASE_URL } from "@/config";

/**
 * Get the stored access token
 */
export const getToken = () => {
  return localStorage.getItem("access_token");
};

/**
 * Set the access token
 */
export const setToken = (token) => {
  localStorage.setItem("access_token", token);
};

/**
 * Remove the access token
 */
export const removeToken = () => {
  localStorage.removeItem("access_token");
};

/**
 * Make an API request with automatic token injection
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Auth API calls
 */
export const authAPI = {
  // Login
  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // Register/Signup
  register: async (email, password, role = "staff") => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });
  },

  // Forgot Password - Request OTP
  forgotPassword: async (email) => {
    return apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Reset Password with OTP
  resetPassword: async (email, otp, newPassword) => {
    return apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, new_password: newPassword }),
    });
  },

  // Get current user profile
  getProfile: async () => {
    return apiRequest("/auth/me");
  },
};


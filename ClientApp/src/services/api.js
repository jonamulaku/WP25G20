const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

// Helper function to get stored user info
const getUserInfo = () => {
    const userStr = localStorage.getItem('userInfo');
    return userStr ? JSON.parse(userStr) : null;
};

// Helper function to set user info
const setUserInfo = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

// Helper function to remove user info
const removeUserInfo = () => {
    localStorage.removeItem('userInfo');
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Handle no-content responses (e.g. 204 from DELETE)
        if (response.status === 204) {
            // Successful with no body
            return null;
        }

        // Check if response has content before trying to parse JSON
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            try {
                data = await response.json();
            } catch (parseError) {
                // If JSON parsing fails, create a generic error
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
        } else {
            // If not JSON, read as text
            const text = await response.text();
            if (!response.ok) {
                // Only treat as error if status is not OK
                throw new Error(text || `HTTP error! status: ${response.status}`);
            }
            // For successful non-JSON with body, just return raw text
            return text || null;
        }

        if (!response.ok) {
            throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        // Re-throw with more context if it's a network error
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('Unable to connect to server. Please check if the backend is running.');
        }
        throw error;
    }
};

// Helper function to dispatch auth change event
const dispatchAuthChange = () => {
    window.dispatchEvent(new Event('authChange'));
};

// Helper to normalize response (backend returns PascalCase, frontend expects camelCase)
const normalizeAuthResponse = (response) => {
    // Backend returns PascalCase (Token, User) but we need camelCase (token, user)
    const user = response.User || response.user;
    const normalizedUser = user ? {
        id: user.Id || user.id,
        email: user.Email || user.email,
        firstName: user.FirstName || user.firstName,
        lastName: user.LastName || user.lastName,
        roles: user.Roles || user.roles || []
    } : null;
    
    return {
        token: response.Token || response.token,
        refreshToken: response.RefreshToken || response.refreshToken,
        expiresAt: response.ExpiresAt || response.expiresAt,
        user: normalizedUser
    };
};

// Auth API functions
export const authAPI = {
    login: async (email, password) => {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        
        // Normalize response (handle PascalCase from backend)
        const normalized = normalizeAuthResponse(response);
        
        // Store token and user info
        if (normalized.token) {
            setAuthToken(normalized.token);
        } else {
            console.error('Login response missing token:', response);
            throw new Error('Login failed: No token received from server');
        }
        
        if (normalized.user) {
            setUserInfo(normalized.user);
        } else {
            console.error('Login response missing user info:', response);
            throw new Error('Login failed: No user info received from server');
        }
        
        // Dispatch auth change event
        dispatchAuthChange();
        
        return normalized;
    },

    register: async (email, password, confirmPassword, firstName, lastName) => {
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                confirmPassword,
                firstName: firstName || null,
                lastName: lastName || null,
            }),
        });
        
        // Normalize response (handle PascalCase from backend)
        const normalized = normalizeAuthResponse(response);
        
        // Store token and user info
        if (normalized.token) {
            setAuthToken(normalized.token);
        }
        if (normalized.user) {
            setUserInfo(normalized.user);
        }
        
        // Dispatch auth change event
        dispatchAuthChange();
        
        return normalized;
    },

    logout: () => {
        removeAuthToken();
        removeUserInfo();
        // Dispatch auth change event
        dispatchAuthChange();
    },

    getCurrentUser: () => {
        return getUserInfo();
    },

    isAuthenticated: () => {
        return !!getAuthToken();
    },
};

// Helper to normalize DTOs (backend returns PascalCase, frontend expects camelCase)
const normalizeDTO = (dto) => {
    if (!dto || typeof dto !== 'object') return dto;
    
    const normalized = {};
    for (const [key, value] of Object.entries(dto)) {
        // Convert PascalCase to camelCase
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
        
        if (Array.isArray(value)) {
            normalized[camelKey] = value.map(item => 
                typeof item === 'object' ? normalizeDTO(item) : item
            );
        } else if (value && typeof value === 'object' && !(value instanceof Date)) {
            normalized[camelKey] = normalizeDTO(value);
        } else {
            normalized[camelKey] = value;
        }
    }
    return normalized;
};

// Clients API
export const clientsAPI = {
    getAll: async (filter = {}) => {
        const params = new URLSearchParams();
        if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
        if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
        if (filter.pageSize) params.append('pageSize', filter.pageSize);
        if (filter.sortBy) params.append('sortBy', filter.sortBy);
        if (filter.sortDescending) params.append('sortDescending', filter.sortDescending);
        
        const response = await apiCall(`/clients?${params.toString()}`);
        return {
            ...response,
            items: response.items?.map(normalizeDTO) || response.Items?.map(normalizeDTO) || []
        };
    },
    
    getById: async (id) => {
        const response = await apiCall(`/clients/${id}`);
        return normalizeDTO(response);
    },
    
    create: async (data) => {
        const response = await apiCall('/clients', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    update: async (id, data) => {
        const response = await apiCall(`/clients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    delete: async (id) => {
        await apiCall(`/clients/${id}`, {
            method: 'DELETE',
        });
    },
};

// Campaigns API
export const campaignsAPI = {
    getAll: async (filter = {}) => {
        const params = new URLSearchParams();
        if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
        if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
        if (filter.pageSize) params.append('pageSize', filter.pageSize);
        if (filter.sortBy) params.append('sortBy', filter.sortBy);
        if (filter.sortDescending) params.append('sortDescending', filter.sortDescending);
        
        const response = await apiCall(`/campaigns?${params.toString()}`);
        return {
            ...response,
            items: response.items?.map(normalizeDTO) || response.Items?.map(normalizeDTO) || []
        };
    },
    
    getById: async (id) => {
        const response = await apiCall(`/campaigns/${id}`);
        return normalizeDTO(response);
    },
    
    create: async (data) => {
        const response = await apiCall('/campaigns', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    update: async (id, data) => {
        const response = await apiCall(`/campaigns/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    delete: async (id) => {
        await apiCall(`/campaigns/${id}`, {
            method: 'DELETE',
        });
    },
};

// Tasks API
export const tasksAPI = {
    getAll: async (filter = {}) => {
        const params = new URLSearchParams();
        if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
        if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
        if (filter.pageSize) params.append('pageSize', filter.pageSize);
        if (filter.sortBy) params.append('sortBy', filter.sortBy);
        if (filter.sortDescending) params.append('sortDescending', filter.sortDescending);
        
        const response = await apiCall(`/tasks?${params.toString()}`);
        return {
            ...response,
            items: response.items?.map(normalizeDTO) || response.Items?.map(normalizeDTO) || []
        };
    },
    
    getMyTasks: async (filter = {}) => {
        const params = new URLSearchParams();
        if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
        if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
        if (filter.pageSize) params.append('pageSize', filter.pageSize);
        
        const response = await apiCall(`/tasks/me?${params.toString()}`);
        return {
            ...response,
            items: response.items?.map(normalizeDTO) || response.Items?.map(normalizeDTO) || []
        };
    },
    
    getById: async (id) => {
        const response = await apiCall(`/tasks/${id}`);
        return normalizeDTO(response);
    },
    
    create: async (data) => {
        const response = await apiCall('/tasks', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    update: async (id, data) => {
        const response = await apiCall(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    delete: async (id) => {
        await apiCall(`/tasks/${id}`, {
            method: 'DELETE',
        });
    },
};

// Services API
export const servicesAPI = {
    getAll: async (filter = {}) => {
        const params = new URLSearchParams();
        if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
        if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
        if (filter.pageSize) params.append('pageSize', filter.pageSize);
        
        const response = await apiCall(`/services?${params.toString()}`);
        return {
            ...response,
            items: response.items?.map(normalizeDTO) || response.Items?.map(normalizeDTO) || []
        };
    },
    
    getById: async (id) => {
        const response = await apiCall(`/services/${id}`);
        return normalizeDTO(response);
    },
    
    create: async (data) => {
        const response = await apiCall('/services', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    update: async (id, data) => {
        const response = await apiCall(`/services/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    delete: async (id) => {
        await apiCall(`/services/${id}`, {
            method: 'DELETE',
        });
    },
};

// Users API
export const usersAPI = {
    getAll: async (filter = {}) => {
        const params = new URLSearchParams();
        if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
        if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
        if (filter.pageSize) params.append('pageSize', filter.pageSize);
        
        const response = await apiCall(`/users?${params.toString()}`);
        return {
            ...response,
            items: response.items?.map(normalizeDTO) || response.Items?.map(normalizeDTO) || []
        };
    },
    
    getById: async (id) => {
        const response = await apiCall(`/users/${id}`);
        return normalizeDTO(response);
    },
    
    getMe: async () => {
        const response = await apiCall('/users/me');
        return normalizeDTO(response);
    },
    
    update: async (id, dto) => {
        const response = await apiCall(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dto),
        });
        return normalizeDTO(response);
    },
    
    delete: async (id) => {
        await apiCall(`/users/${id}`, {
            method: 'DELETE',
        });
        return true;
    },
};

// Team Members API
export const teamMembersAPI = {
    getAll: async (filter = {}) => {
        const params = new URLSearchParams();
        if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
        if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
        if (filter.pageSize) params.append('pageSize', filter.pageSize);
        if (filter.sortBy) params.append('sortBy', filter.sortBy);
        if (filter.sortDescending) params.append('sortDescending', filter.sortDescending);
        
        const response = await apiCall(`/teammembers?${params.toString()}`);
        return {
            ...response,
            items: response.items?.map(normalizeDTO) || response.Items?.map(normalizeDTO) || []
        };
    },
    
    getById: async (id) => {
        const response = await apiCall(`/teammembers/${id}`);
        return normalizeDTO(response);
    },
    
    create: async (data) => {
        const response = await apiCall('/teammembers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    update: async (id, data) => {
        const response = await apiCall(`/teammembers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    delete: async (id) => {
        await apiCall(`/teammembers/${id}`, {
            method: 'DELETE',
        });
    },
};

// Invoices API
export const invoicesAPI = {
    getAll: async (filter = {}) => {
        const params = new URLSearchParams();
        if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
        if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
        if (filter.pageSize) params.append('pageSize', filter.pageSize);
        
        const response = await apiCall(`/invoices?${params.toString()}`);
        return {
            ...response,
            items: response.items?.map(normalizeDTO) || response.Items?.map(normalizeDTO) || []
        };
    },
    
    getById: async (id) => {
        const response = await apiCall(`/invoices/${id}`);
        return normalizeDTO(response);
    },
    
    create: async (data) => {
        const response = await apiCall('/invoices', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    update: async (id, data) => {
        const response = await apiCall(`/invoices/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    delete: async (id) => {
        await apiCall(`/invoices/${id}`, {
            method: 'DELETE',
        });
    },
};

// Payments API
export const paymentsAPI = {
    getAll: async (filter = {}) => {
        const params = new URLSearchParams();
        if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
        if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
        if (filter.pageSize) params.append('pageSize', filter.pageSize);
        
        const response = await apiCall(`/payments?${params.toString()}`);
        return {
            ...response,
            items: response.items?.map(normalizeDTO) || response.Items?.map(normalizeDTO) || []
        };
    },
    
    getById: async (id) => {
        const response = await apiCall(`/payments/${id}`);
        return normalizeDTO(response);
    },
    
    create: async (data) => {
        const response = await apiCall('/payments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
};

// Messages API
export const messagesAPI = {
    getAll: async (filter = {}) => {
        const params = new URLSearchParams();
        if (filter.type) params.append('type', filter.type);
        if (filter.status) params.append('status', filter.status);
        if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
        if (filter.pageNumber) params.append('pageNumber', filter.pageNumber);
        if (filter.pageSize) params.append('pageSize', filter.pageSize);
        
        const response = await apiCall(`/messages?${params.toString()}`);
        return {
            ...response,
            items: response.items?.map(normalizeDTO) || response.Items?.map(normalizeDTO) || []
        };
    },
    
    getById: async (id) => {
        const response = await apiCall(`/messages/${id}`);
        return normalizeDTO(response);
    },
    
    create: async (data) => {
        // Contact form doesn't require auth
        const response = await apiCall('/messages', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    update: async (id, data) => {
        const response = await apiCall(`/messages/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return normalizeDTO(response);
    },
    
    delete: async (id) => {
        await apiCall(`/messages/${id}`, {
            method: 'DELETE',
        });
    },
    
    getUnreadCount: async () => {
        const response = await apiCall('/messages/unread-count');
        return response;
    },
};

// Activity Logs API (using direct endpoint since there's no dedicated controller yet)
export const activityLogsAPI = {
    getRecent: async (count = 50) => {
        // We'll need to add this endpoint, but for now we'll use a workaround
        // or fetch from a general endpoint if available
        try {
            const response = await apiCall(`/activitylogs/recent?count=${count}`);
            return {
                items: response.items?.map(normalizeDTO) || response.Items?.map(normalizeDTO) || response || []
            };
        } catch (error) {
            console.warn('Activity logs endpoint not available:', error);
            return { items: [] };
        }
    },
};

export default apiCall;

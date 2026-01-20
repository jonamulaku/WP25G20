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
            throw new Error(text || `HTTP error! status: ${response.status}`);
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

export default apiCall;

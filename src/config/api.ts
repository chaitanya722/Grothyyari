// API configuration and client setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Request failed');
      }

      return result;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name: string, email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  // User endpoints
  async getUser(id: string) {
    return this.request<{ user: any }>(`/users/${id}`);
  }

  async updateProfile(data: any) {
    return this.request<{ user: any }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async searchUsers(params: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.request<{ users: any[] }>(`/users?${queryString}`);
  }

  // Posts endpoints
  async getFeed(page = 1, limit = 10) {
    return this.request<{ posts: any[] }>(`/posts/feed?page=${page}&limit=${limit}`);
  }

  async createPost(postData: any) {
    return this.request<{ post: any }>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId: string) {
    return this.request<{ liked: boolean }>(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async addComment(postId: string, content: string) {
    return this.request<{ comment: any }>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Sessions endpoints
  async getSessions(type?: string) {
    const params = type ? `?type=${type}` : '';
    return this.request<{ sessions: any[] }>(`/sessions${params}`);
  }

  async bookSession(sessionData: any) {
    return this.request<{ session: any }>('/sessions/book', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateSessionStatus(sessionId: string, status: string) {
    return this.request<{ session: any }>(`/sessions/${sessionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Connections endpoints
  async getConnections() {
    return this.request<{ connections: any[] }>('/connections');
  }

  async sendConnectionRequest(userId: string, message: string) {
    return this.request<{ request: any }>('/connections/request', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, message }),
    });
  }

  async getConnectionRequests(type = 'received') {
    return this.request<{ requests: any[] }>(`/connections/requests?type=${type}`);
  }

  async respondToConnectionRequest(requestId: string, action: 'accept' | 'decline') {
    return this.request<{ status: string }>(`/connections/requests/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    });
  }

  // YariConnect endpoints
  async getYariConnectProfessionals(filters: any) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request<{ professionals: any[] }>(`/yari-connect/professionals?${queryString}`);
  }

  async startYariConnectSession(participantId: string) {
    return this.request<{ session: any }>('/yari-connect/sessions/start', {
      method: 'POST',
      body: JSON.stringify({ participant_id: participantId }),
    });
  }

  async endYariConnectSession(sessionId: string) {
    return this.request<{ duration: number }>(`/yari-connect/sessions/${sessionId}/end`, {
      method: 'PATCH',
    });
  }

  // Search endpoints
  async search(query: string, type = 'all') {
    return this.request<{ results: any }>(`/search?q=${encodeURIComponent(query)}&type=${type}`);
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request<{ notifications: any[] }>('/notifications');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request('/notifications/' + notificationId + '/read', {
      method: 'PATCH',
    });
  }

  // Upload endpoints
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/upload/single`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      return { success: false, error: 'Upload failed' };
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
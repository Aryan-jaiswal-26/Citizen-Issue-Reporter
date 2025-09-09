import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Issue, Notification } from '../types';

const API_BASE_URL = __DEV__ ? 'http://10.209.55.169:5000' : 'https://your-api.com';

console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('📄 Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('🌐 Network Error - No Response:', error.request);
    }
    return Promise.reject(error);
  }
);

// Auth token management
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Sync offline data
export const syncOfflineData = async () => {
  const offline = await AsyncStorage.getItem('offline_issues');
  if (offline) {
    const offlineIssues = JSON.parse(offline);
    for (const issue of offlineIssues) {
      try {
        await api.post('/issues', issue);
      } catch (error) {
        console.log('Sync failed for issue:', issue.id);
      }
    }
    await AsyncStorage.removeItem('offline_issues');
  }
};

// Mock data for development
const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues',
    category: 'Road',
    status: 'Pending',
    location: 'Main Street, Downtown',
    upvotes: 15,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    userId: 'user1',
    userName: 'John Doe'
  },
  {
    id: '2',
    title: 'Water Leak in Park Avenue',
    description: 'Continuous water leak from underground pipe',
    category: 'Water',
    status: 'In Progress',
    location: 'Park Avenue, Block 5',
    upvotes: 8,
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    userId: 'user2',
    userName: 'Jane Smith'
  }
];

export const issuesAPI = {
  async getAll(): Promise<Issue[]> {
    try {
      const response = await api.get('/issues');
      const issues = response.data;
      await AsyncStorage.setItem('cached_issues', JSON.stringify(issues));
      return issues;
    } catch (error) {
      console.warn('API call failed, using cached data');
      const cached = await AsyncStorage.getItem('cached_issues');
      return cached ? JSON.parse(cached) : mockIssues;
    }
  },

  async create(issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'upvotes'>): Promise<Issue> {
    try {
      const response = await api.post('/issues', issueData);
      return response.data;
    } catch (error) {
      // Store offline for sync later
      const offline = await AsyncStorage.getItem('offline_issues') || '[]';
      const offlineIssues = JSON.parse(offline);
      const newIssue = { ...issueData, id: Date.now().toString(), offline: true };
      offlineIssues.push(newIssue);
      await AsyncStorage.setItem('offline_issues', JSON.stringify(offlineIssues));
      throw error;
    }
  },

  async upvote(id: string): Promise<Issue> {
    try {
      const response = await api.post(`/issues/${id}/upvote`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async uploadImage(imageUri: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'issue.jpg',
    } as any);
    
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url;
    } catch (error) {
      return imageUri;
    }
  }
};

export const authAPI = {
  async login(email: string, password: string) {
    try {
      console.log('🔐 Attempting login to:', API_BASE_URL + '/auth/login');
      console.log('📧 Email:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login successful:', response.data);
      const { token, user } = response.data;
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      return { token, user };
    } catch (error: any) {
      console.error('❌ Login error:', error.message);
      console.error('🌐 Network error details:', error.response?.data || error);
      throw error;
    }
  },

  async register(userData: any) {
    try {
      console.log('📝 Attempting registration to:', API_BASE_URL + '/auth/signup');
      console.log('👤 User data:', userData);
      const response = await api.post('/auth/signup', userData);
      console.log('✅ Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration error:', error.message);
      console.error('🌐 Network error details:', error.response?.data || error);
      throw error;
    }
  },

  async logout() {
    await AsyncStorage.multiRemove(['auth_token', 'user_data']);
  }
};
import axios from 'axios';
import { User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getProfile: () => api.get('/auth/me'),

  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    company?: string;
  }) => api.put('/auth/profile', data),

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => api.put('/auth/change-password', data),
};

// Contacts API
export const contactsApi = {
  getContacts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    consentOnly?: boolean;
    status?: string;
  }) => api.get('/contacts', { params }),

  createContact: (data: {
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    phone?: string;
    notes?: string;
    consentSource?: string;
  }) => api.post('/contacts', data),

  getContact: (id: string) => api.get(`/contacts/${id}`),

  updateContact: (id: string, data: any) => api.put(`/contacts/${id}`, data),

  deleteContact: (id: string) => api.delete(`/contacts/${id}`),

  importCSV: (file: File, consentSource?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (consentSource) {
      formData.append('consentSource', consentSource);
    }
    return api.post('/contacts/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getImportBatches: () => api.get('/contacts/import/batches'),

  updateConsent: (id: string, consentGiven: boolean, source?: string) =>
    api.put(`/contacts/${id}/consent`, { consentGiven, source }),
};

// Mail Accounts API
export const mailAccountsApi = {
  getMailAccounts: () => api.get('/mail-accounts'),

  createMailAccount: (data: any) => api.post('/mail-accounts', data),

  getMailAccount: (id: string) => api.get(`/mail-accounts/${id}`),

  updateMailAccount: (id: string, data: any) => api.put(`/mail-accounts/${id}`, data),

  deleteMailAccount: (id: string) => api.delete(`/mail-accounts/${id}`),

  testConnection: (id: string) => api.post(`/mail-accounts/${id}/test`),

  toggleActive: (id: string) => api.put(`/mail-accounts/${id}/toggle`),

  checkLimit: (id: string) => api.get(`/mail-accounts/${id}/limit`),

  getProviderSettings: (provider: string) =>
    api.get(`/mail-accounts/providers/${provider}`),
};

// Campaigns API
export const campaignsApi = {
  getCampaigns: () => api.get('/campaigns'),

  createCampaign: (data: any) => api.post('/campaigns', data),

  getCampaign: (id: string) => api.get(`/campaigns/${id}`),

  startCampaign: (id: string) => api.post(`/campaigns/${id}/start`),

  cancelCampaign: (id: string) => api.post(`/campaigns/${id}/cancel`),

  getCampaignEmails: (id: string) => api.get(`/campaigns/${id}/emails`),
};

// Emails API
export const emailsApi = {
  getEmails: (params?: { campaignId?: string }) =>
    api.get('/emails', { params }),
};

// Dashboard API
export const dashboardApi = {
  getMetrics: () => api.get('/dashboard'),
};

// Inbox API
export const inboxApi = {
  getReplies: (params?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/inbox', { params }),

  markAsRead: (id: string, isRead: boolean) =>
    api.put(`/inbox/${id}/read`, { isRead }),
};

// Chat API
export const chatApi = {
  getSessions: () => api.get('/chat/sessions'),

  createSession: (data: {
    title?: string;
    contextType?: string;
    contextId?: string;
  }) => api.post('/chat/sessions', data),

  getSession: (id: string) => api.get(`/chat/sessions/${id}`),

  sendMessage: (id: string, content: string) =>
    api.post(`/chat/sessions/${id}/messages`, { content }),
};

export default api;
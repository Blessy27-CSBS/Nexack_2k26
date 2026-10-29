import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL;
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  return '/api';
};

const API = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
});

// Interceptor for attaching auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isPublic = error.config.url?.startsWith('/tracks') || error.config.url?.startsWith('/settings');
      if (!isPublic && window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('nexack_token');
        localStorage.removeItem('nexack_role');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  loginAdmin: (credentials) => API.post('/auth/admin/login', credentials),
  loginParticipant: (credentials) => API.post('/auth/participant/login', credentials),
  resetParticipantPassword: (data) => API.post('/auth/participant/reset-password', data),
  getMe: () => API.get('/auth/me'),
};

// Team & Registration Service
export const teamService = {
  register: (formData) => API.post('/register', formData, {
    headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  }),
  getMyTeam: () => API.get('/my-team'),
  updateMyTeam: (data) => API.put('/my-team', data),
  uploadPayment: (formData) => API.post('/my-team/payment', formData, {
    headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  }),
  getAllAdmin: (params) => API.get('/admin/teams', { params }),
  updatePaymentStatus: (id, data) => API.patch(`/admin/teams/${id}/payment`, data),
  updateRegistrationStatus: (id, data) => API.patch(`/admin/teams/${id}/status`, data),
  deleteTeam: (id) => API.delete(`/admin/teams/${id}`),
};

// Track Service
export const trackService = {
  getPublished: () => API.get('/tracks'),
  getById: (id) => API.get(`/tracks/${id}`),
  getAllAdmin: () => API.get('/admin/tracks'),
  create: (data) => API.post('/admin/tracks', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  }),
  update: (id, data) => API.put(`/admin/tracks/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  }),
  delete: (id) => API.delete(`/admin/tracks/${id}`),
};

// Submission Service
export const submissionService = {
  getMySubmission: () => API.get('/my-submission'),
  saveOrSubmit: (formData) => API.post('/my-submission', formData, {
    headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  }),
  getAllAdmin: (params) => API.get('/admin/submissions', { params }),
  updateStatus: (id, status) => API.patch(`/admin/submissions/${id}/status`, { status }),
  assignJudges: (id, judgeIds) => API.put(`/admin/submissions/${id}/assign-judges`, { judgeIds }),
};

// Judge & Evaluation Service
export const judgeService = {
  getProjects: () => API.get('/judge/projects'),
  submitEvaluation: (data) => API.post('/judge/evaluate', data),
  getAllJudges: () => API.get('/admin/judges'),
  createJudge: (data) => API.post('/admin/judges', data),
  unlockEvaluation: (id) => API.patch(`/admin/evaluations/${id}/unlock`),
};

// Leaderboard Service
export const leaderboardService = {
  getLeaderboard: () => API.get('/leaderboard'),
};

// Results Service
export const resultService = {
  getPublic: () => API.get('/results'),
  getAllAdmin: () => API.get('/admin/results'),
  create: (data) => API.post('/admin/results', data),
  update: (id, data) => API.put(`/admin/results/${id}`, data),
  delete: (id) => API.delete(`/admin/results/${id}`),
  togglePublish: (isResultsPublished) => API.post('/admin/results/publish', { isResultsPublished }),
};

// Admin Metrics & Stats
export const adminService = {
  getStats: () => API.get('/admin/stats'),
  getParticipants: (params) => API.get('/admin/participants', { params }),
};

// Public Stats Service
export const statsService = {
  getPublicStats: () => API.get('/stats'),
};

// Generic CRUD service generator for dynamic items
const createCRUDService = (endpoint) => ({
  getAll: () => API.get(`/admin/${endpoint}`),
  getAllAdmin: () => API.get(`/admin/${endpoint}`),
  getPublic: () => API.get(`/${endpoint}`),
  create: (data) => API.post(`/admin/${endpoint}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  }),
  update: (id, data) => API.put(`/admin/${endpoint}/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  }),
  delete: (id) => API.delete(`/admin/${endpoint}/${id}`),
});

export const mentorService = createCRUDService('mentors');
export const mentorsService = mentorService;

export const facultyService = createCRUDService('faculty');

export const associationService = createCRUDService('association');

export const sponsorService = createCRUDService('sponsors');
export const sponsorsService = sponsorService;

export const timelineService = createCRUDService('timeline');

export const prizeService = createCRUDService('prizes');
export const prizesService = prizeService;

export const ruleService = createCRUDService('rules');
export const rulesService = ruleService;

export const faqService = createCRUDService('faqs');
export const faqsService = faqService;

export const announcementService = createCRUDService('announcements');
export const announcementsService = announcementService;

export const galleryService = createCRUDService('gallery');

// Contact Service
export const contactService = {
  sendMessage: (data) => API.post('/contact', data),
  getAll: (params) => API.get('/admin/messages', { params }),
  getAllAdmin: (params) => API.get('/admin/messages', { params }),
  update: (id, data) => API.patch(`/admin/messages/${id}/status`, data),
  updateStatus: (id, status) => API.patch(`/admin/messages/${id}/status`, { status }),
  markRead: (id) => API.patch(`/admin/messages/${id}/read`),
  delete: (id) => API.delete(`/admin/messages/${id}`),
};
export const messagesService = contactService;

// Settings Service
export const settingsService = {
  getPublic: () => API.get('/settings'),
  getPublicSettings: () => API.get('/settings'),
  getAdmin: () => API.get('/admin/settings'),
  update: (data) => {
    if (data instanceof FormData) {
      return API.put('/admin/settings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return API.put('/admin/settings', data);
  },
  updateSettings: (data) => {
    if (data instanceof FormData) {
      return API.put('/admin/settings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return API.put('/admin/settings', data);
  },
};

// Media URL Resolver with Google Drive Link Transformer
export const getImageUrl = (image) => {
  if (!image) return '';

  // Handle Google Drive links
  if (typeof image === 'string' && (image.includes('drive.google.com') || image.includes('googleusercontent.com'))) {
    const fileDMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
    }
    const idMatch = image.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
    if (image.includes('googleusercontent.com/d/')) {
      return image;
    }
  }

  if (image.startsWith('http')) return image;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
};

export default API;

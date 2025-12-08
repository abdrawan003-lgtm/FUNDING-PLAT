import axios from "axios";

const API_BASE = "http://localhost:5005"; // رابط السيرفر

export const getProjects = () => axios.get(`${API_BASE}/projects`);
export const getProjectById = (id) => axios.get(`${API_BASE}/projects/${id}`);
export const createProject = (data) => axios.post(`${API_BASE}/projects`, data);
export const loginUser = (data) => axios.post(`${API_BASE}/auth/login`, data);
export const registerUser = (data) => axios.post(`${API_BASE}/auth/register`, data);
export const getProfile = (userId) => axios.get(`${API_BASE}/users/${userId}`);

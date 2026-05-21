import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPosts = () => api.get("/posts").then((r) => r.data);
export const getPost = (id) => api.get(`/posts/${id}`).then((r) => r.data);
export const searchPosts = (q) =>
  api.get(`/posts/search?q=${q}`).then((r) => r.data);
export const createPost = (data) =>
  api.post("/posts", data).then((r) => r.data);
export const updatePost = (id, data) =>
  api.put(`/posts/${id}`, data).then((r) => r.data);
export const deletePost = (id) =>
  api.delete(`/posts/${id}`).then((r) => r.data);

export const login = async (email, senha) => {
  const res = await api.post("/auth/login", { email, senha });
  await AsyncStorage.setItem("token", res.data.token);
  return res.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
};

export const getTeachers = () => api.get("/teachers").then((r) => r.data);
export const getTeacher = (id) =>
  api.get(`/teachers/${id}`).then((r) => r.data);
export const createTeacher = (data) =>
  api.post("/teachers", data).then((r) => r.data);
export const updateTeacher = (id, data) =>
  api.put(`/teachers/${id}`, data).then((r) => r.data);
export const deleteTeacher = (id) =>
  api.delete(`/teachers/${id}`).then((r) => r.data);

export const getStudents = () => api.get("/students").then((r) => r.data);
export const getStudent = (id) =>
  api.get(`/students/${id}`).then((r) => r.data);
export const createStudent = (data) =>
  api.post("/students", data).then((r) => r.data);
export const updateStudent = (id, data) =>
  api.put(`/students/${id}`, data).then((r) => r.data);
export const deleteStudent = (id) =>
  api.delete(`/students/${id}`).then((r) => r.data);

export default api;

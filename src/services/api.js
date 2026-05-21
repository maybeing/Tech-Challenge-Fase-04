import { Platform } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }

  const debuggerHost = Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    return `http://${debuggerHost.split(":")[0]}:3000`;
  }

  if (typeof window !== "undefined" && window.location?.hostname) {
    return `http://${window.location.hostname}:3000`;
  }

  return "http://localhost:3000";
};

const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API error:",
      error.config?.url,
      error.response?.status,
      error.response?.data,
    );
    return Promise.reject(error);
  },
);

const STORAGE_KEYS = {
  POSTS: "local_posts",
  TEACHERS: "local_teachers",
  STUDENTS: "local_students",
};

const INITIAL_TEACHERS = [
  {
    _id: "local_admin",
    nome: "Administrador",
    email: "admin@blog.com",
    senha: "123456",
  },
];

const INITIAL_POSTS = [
  {
    _id: "local_post_1",
    titulo: "Bem-vindo ao Blog",
    autor: "Equipe do App",
    conteudo:
      "O servidor está indisponível. Use este modo local para continuar testando o app enquanto o backend não estiver pronto.",
    dataCriacao: new Date().toISOString(),
  },
];

const handleLocalError = async (key, initialValue) => {
  const stored = await AsyncStorage.getItem(key);
  if (!stored) {
    await AsyncStorage.setItem(key, JSON.stringify(initialValue));
    return initialValue;
  }

  try {
    return JSON.parse(stored);
  } catch {
    await AsyncStorage.setItem(key, JSON.stringify(initialValue));
    return initialValue;
  }
};

const saveLocalData = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
  return value;
};

const createLocalId = (prefix = "item") =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const isRecoverableError = (error) => {
  if (!error?.response) {
    return true;
  }
  return error.response.status >= 500;
};

const getLocalPosts = async () =>
  handleLocalError(STORAGE_KEYS.POSTS, INITIAL_POSTS);

const getLocalTeachers = async () =>
  handleLocalError(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);

const getLocalStudents = async () =>
  handleLocalError(STORAGE_KEYS.STUDENTS, []);

const localPostById = async (id) => {
  const posts = await getLocalPosts();
  return posts.find((post) => post._id === id);
};

const localTeacherById = async (id) => {
  const teachers = await getLocalTeachers();
  return teachers.find((teacher) => teacher._id === id);
};

const localStudentById = async (id) => {
  const students = await getLocalStudents();
  return students.find((student) => student._id === id);
};

const localSearchPosts = async (query) => {
  const posts = await getLocalPosts();
  const lower = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.titulo.toLowerCase().includes(lower) ||
      post.autor.toLowerCase().includes(lower) ||
      post.conteudo.toLowerCase().includes(lower),
  );
};

const fallbackPostSave = async (post) => {
  const posts = await getLocalPosts();
  const next = [post, ...posts];
  return saveLocalData(STORAGE_KEYS.POSTS, next);
};

const fallbackPostUpdate = async (id, data) => {
  const posts = await getLocalPosts();
  const next = posts.map((post) =>
    post._id === id ? { ...post, ...data } : post,
  );
  await saveLocalData(STORAGE_KEYS.POSTS, next);
  return next.find((post) => post._id === id);
};

const fallbackPostDelete = async (id) => {
  const posts = await getLocalPosts();
  const next = posts.filter((post) => post._id !== id);
  await saveLocalData(STORAGE_KEYS.POSTS, next);
  return { success: true };
};

const fallbackTeacherSave = async (teacher) => {
  const teachers = await getLocalTeachers();
  const next = [teacher, ...teachers];
  return saveLocalData(STORAGE_KEYS.TEACHERS, next);
};

const fallbackTeacherUpdate = async (id, data) => {
  const teachers = await getLocalTeachers();
  const next = teachers.map((teacher) =>
    teacher._id === id ? { ...teacher, ...data } : teacher,
  );
  await saveLocalData(STORAGE_KEYS.TEACHERS, next);
  return next.find((teacher) => teacher._id === id);
};

const fallbackTeacherDelete = async (id) => {
  const teachers = await getLocalTeachers();
  const next = teachers.filter((teacher) => teacher._id !== id);
  await saveLocalData(STORAGE_KEYS.TEACHERS, next);
  return { success: true };
};

const fallbackStudentSave = async (student) => {
  const students = await getLocalStudents();
  const next = [student, ...students];
  return saveLocalData(STORAGE_KEYS.STUDENTS, next);
};

const fallbackStudentUpdate = async (id, data) => {
  const students = await getLocalStudents();
  const next = students.map((student) =>
    student._id === id ? { ...student, ...data } : student,
  );
  await saveLocalData(STORAGE_KEYS.STUDENTS, next);
  return next.find((student) => student._id === id);
};

const fallbackStudentDelete = async (id) => {
  const students = await getLocalStudents();
  const next = students.filter((student) => student._id !== id);
  await saveLocalData(STORAGE_KEYS.STUDENTS, next);
  return { success: true };
};

export const getPosts = async () => {
  try {
    return (await api.get("/posts")).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return getLocalPosts();
    }
    throw error;
  }
};

export const getPost = async (id) => {
  try {
    return (await api.get(`/posts/${id}`)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return localPostById(id);
    }
    throw error;
  }
};

export const searchPosts = async (q) => {
  try {
    return (await api.get(`/posts/search?q=${encodeURIComponent(q)}`)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return localSearchPosts(q);
    }
    throw error;
  }
};

export const createPost = async (data) => {
  const payload = {
    ...data,
    _id: createLocalId("post"),
    dataCriacao: new Date().toISOString(),
  };
  try {
    return (await api.post("/posts", data)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return fallbackPostSave(payload);
    }
    throw error;
  }
};

export const updatePost = async (id, data) => {
  try {
    return (await api.put(`/posts/${id}`, data)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return fallbackPostUpdate(id, data);
    }
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    return (await api.delete(`/posts/${id}`)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return fallbackPostDelete(id);
    }
    throw error;
  }
};

export const login = async (email, senha) => {
  try {
    const res = await api.post("/auth/login", { email, senha });
    await AsyncStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    if (isRecoverableError(error)) {
      const teachers = await getLocalTeachers();
      const teacher = teachers.find(
        (teacherItem) =>
          teacherItem.email.toLowerCase() === email.toLowerCase() &&
          teacherItem.senha === senha,
      );
      if (teacher) {
        const token = `local_${Date.now()}`;
        await AsyncStorage.setItem("token", token);
        return { token, teacher };
      }
    }
    throw error;
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
};

export const getTeachers = async () => {
  try {
    return (await api.get("/teachers")).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return getLocalTeachers();
    }
    throw error;
  }
};

export const getTeacher = async (id) => {
  try {
    return (await api.get(`/teachers/${id}`)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return localTeacherById(id);
    }
    throw error;
  }
};

export const createTeacher = async (data) => {
  const payload = { ...data, _id: createLocalId("teacher") };
  try {
    return (await api.post("/teachers", data)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return fallbackTeacherSave(payload);
    }
    throw error;
  }
};

export const updateTeacher = async (id, data) => {
  try {
    return (await api.put(`/teachers/${id}`, data)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return fallbackTeacherUpdate(id, data);
    }
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    return (await api.delete(`/teachers/${id}`)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return fallbackTeacherDelete(id);
    }
    throw error;
  }
};

export const getStudents = async () => {
  try {
    return (await api.get("/students")).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return getLocalStudents();
    }
    throw error;
  }
};

export const getStudent = async (id) => {
  try {
    return (await api.get(`/students/${id}`)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return localStudentById(id);
    }
    throw error;
  }
};

export const createStudent = async (data) => {
  const payload = { ...data, _id: createLocalId("student") };
  try {
    return (await api.post("/students", data)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return fallbackStudentSave(payload);
    }
    throw error;
  }
};

export const updateStudent = async (id, data) => {
  try {
    return (await api.put(`/students/${id}`, data)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return fallbackStudentUpdate(id, data);
    }
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    return (await api.delete(`/students/${id}`)).data;
  } catch (error) {
    if (isRecoverableError(error)) {
      return fallbackStudentDelete(id);
    }
    throw error;
  }
};

export default api;

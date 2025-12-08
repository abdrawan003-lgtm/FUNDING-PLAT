import apiClient from "./apiClient";

export const getAllProjects = async () => {
  const res = await apiClient.get("/api/projects");
  return res.data;
};

export const createProject = async (data) => {
  const res = await apiClient.post("/api/projects", data);
  return res.data;
};

export const getProjectById = async (id) => {
  const res = await apiClient.get(`/api/projects/${id}`);
  return res.data;
};

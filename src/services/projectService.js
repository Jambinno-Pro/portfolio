import api from "../api/api";

// ==========================
// GET ALL PROJECTS
// ==========================
export const getProjects = async () => {

  const response = await api.get("/projects");

  return response.data.projects;

};

// ==========================
// GET SINGLE PROJECT
// ==========================
export const getProject = async (id) => {

  const response = await api.get(`/projects/${id}`);

  return response.data.project;

};

// ==========================
// CREATE PROJECT
// ==========================
export const createProject = async (project, token) => {

  const response = await api.post(

    "/projects",

    project,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }

  );

  return response.data;

};

// ==========================
// UPDATE PROJECT
// ==========================
export const updateProject = async (

  id,

  project,

  token

) => {

  const response = await api.put(

    `/projects/${id}`,

    project,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }

  );

  return response.data;

};

// ==========================
// DELETE PROJECT
// ==========================
export const deleteProject = async (

  id,

  token

) => {

  const response = await api.delete(

    `/projects/${id}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

  );

  return response.data;

};
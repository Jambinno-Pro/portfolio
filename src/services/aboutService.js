import api from "../api/api";

// ==========================
// GET ABOUT
// ==========================

export const getAbout = async () => {
  const response = await api.get("/about");
  return response.data;
};

// ==========================
// GET SINGLE ABOUT
// ==========================

export const getAboutById = async (id) => {
  const response = await api.get(`/about/${id}`);
  return response.data;
};

// ==========================
// CREATE ABOUT
// ==========================

export const createAbout = async (formData, token) => {

  const response = await api.post(

    "/about",

    formData,

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
// UPDATE ABOUT
// ==========================

export const updateAbout = async (

  id,

  formData,

  token

) => {

  const response = await api.put(

    `/about/${id}`,

    formData,

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
// DELETE ABOUT
// ==========================

export const deleteAbout = async (

  id,

  token

) => {

  const response = await api.delete(

    `/about/${id}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

  );

  return response.data;

};
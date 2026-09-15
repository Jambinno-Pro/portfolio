import api from "../api/api";

/* ======================================================
   GET ALL GALLERY ITEMS
====================================================== */

export const getGallery = async () => {
  const response = await api.get("/gallery", {
    timeout: 15000,
  });

  return Array.isArray(response.data?.gallery) ? response.data.gallery : [];
};

/* ======================================================
   GET SINGLE GALLERY ITEM
====================================================== */

export const getGalleryItem = async (id) => {
  const response = await api.get(`/gallery/${id}`);

  return response.data.galleryItem;
};

/* ======================================================
   GET GALLERY FOR A PROJECT
====================================================== */

export const getProjectGallery = async (projectId) => {
  if (!projectId) {
    return [];
  }

  const response = await api.get(`/gallery/project/${projectId}`, {
    timeout: 15000,
  });

  return Array.isArray(response.data?.gallery) ? response.data.gallery : [];
};

/* ======================================================
   CREATE GALLERY ITEM
====================================================== */

export const createGallery = async (galleryData, token) => {
  const response = await api.post("/gallery", galleryData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/* ======================================================
   UPDATE GALLERY ITEM
====================================================== */

export const updateGallery = async (id, galleryData, token) => {
  const response = await api.put(`/gallery/${id}`, galleryData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/* ======================================================
   DELETE GALLERY ITEM
====================================================== */

export const deleteGallery = async (id, token) => {
  const response = await api.delete(`/gallery/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

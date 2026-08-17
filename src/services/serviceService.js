import api from "../api/api";

// ==========================
// GET ALL SERVICES
// ==========================
export const getServices = async () => {
  const response = await api.get("/services");
  return response.data;
};

// ==========================
// GET SINGLE SERVICE
// ==========================
export const getService = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

// ==========================
// CREATE SERVICE
// ==========================
export const createService = async (service, token) => {
  const response = await api.post(
    "/services",
    service,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ==========================
// UPDATE SERVICE
// ==========================
export const updateService = async (
  id,
  service,
  token
) => {

  const response = await api.put(
    `/services/${id}`,
    service,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;

};

// ==========================
// DELETE SERVICE
// ==========================
export const deleteService = async (
  id,
  token
) => {

  const response = await api.delete(
    `/services/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;

};
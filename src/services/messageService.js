import api from "../api/api";

// ==========================
// SEND MESSAGE
// PUBLIC
// ==========================

export const sendMessage = async (messageData) => {
  const response = await api.post(
    "/messages",
    messageData
  );

  return response.data;
};


// ==========================
// GET ALL MESSAGES
// ADMIN
// ==========================

export const getMessages = async (token) => {
  const response = await api.get(
    "/messages",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==========================
// GET SINGLE MESSAGE
// ADMIN
// ==========================

export const getMessage = async (id, token) => {
  const response = await api.get(
    `/messages/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==========================
// UPDATE MESSAGE STATUS
// ADMIN
// ==========================

export const updateMessageStatus = async (
  id,
  status,
  token
) => {
  const response = await api.put(
    `/messages/${id}/status`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==========================
// DELETE MESSAGE
// ADMIN
// ==========================

export const deleteMessage = async (
  id,
  token
) => {
  const response = await api.delete(
    `/messages/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
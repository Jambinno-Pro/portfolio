import api from "../api/api";

// ==========================
// GET ALL SKILLS
// ==========================
export const getSkills = async () => {
  const response = await api.get("/skills");

  return response.data.skills || [];
};


// ==========================
// GET SINGLE SKILL
// ==========================
export const getSkill = async (id) => {
  const response = await api.get(`/skills/${id}`);

  return response.data.skill;
};


// ==========================
// CREATE SKILL
// ==========================
export const createSkill = async (skill, token) => {
  const response = await api.post(
    "/skills",
    skill,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==========================
// UPDATE SKILL
// ==========================
export const updateSkill = async (
  id,
  skill,
  token
) => {
  const response = await api.put(
    `/skills/${id}`,
    skill,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==========================
// DELETE SKILL
// ==========================
export const deleteSkill = async (
  id,
  token
) => {
  const response = await api.delete(
    `/skills/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
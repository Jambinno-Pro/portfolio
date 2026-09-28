const Resume = require("../models/Resume");

// =======================================
// GET RESUME
// =======================================

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne();

    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("GET RESUME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// CREATE / UPDATE RESUME
// =======================================

const saveResume = async (req, res) => {
  try {
    let resume = await Resume.findOne();

    const parseArray = (value, fallback = []) => {
      return Array.isArray(value) ? value : fallback;
    };

    const normalizeText = (value) => {
      if (value === undefined || value === null) return value;

      return String(value)
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim();
    };

    // =======================================
    // NORMALIZE EXPERIENCE
    // =======================================

    const normalizeExperience = (items) =>
      items.map((item = {}) => ({
        company: normalizeText(item.company),
        position: normalizeText(item.position),
        period: normalizeText(item.period),
        description: normalizeText(item.description),
      }));

    // =======================================
    // NORMALIZE EDUCATION
    // =======================================

    const normalizeEducation = (items) =>
      items.map((item = {}) => ({
        school: normalizeText(item.school),
        qualification: normalizeText(item.qualification),
        period: normalizeText(item.period),
      }));

    // =======================================
    // NORMALIZE CERTIFICATES
    // =======================================

    const normalizeCertificates = (items) =>
      items.map((item = {}) => ({
        name: normalizeText(item.name),
        issuer: normalizeText(item.issuer),
        year: normalizeText(item.year),
      }));

    // =======================================
    // NORMALIZE PROFESSIONAL SKILLS
    // =======================================

    const normalizeSkills = (items) =>
      items.map((item = {}) => ({
        name: normalizeText(item.name),
        level: normalizeText(item.level),
      }));

    // =======================================
    // NORMALIZE LANGUAGES
    // =======================================

    const normalizeLanguages = (items) =>
      items.map((item = {}) => ({
        name: normalizeText(item.name),
        level: normalizeText(item.level),
      }));

    // =======================================
    // PREPARE COLLECTIONS
    // =======================================

    const experience = normalizeExperience(
      parseArray(req.body.experience, resume?.experience || [])
    );

    const education = normalizeEducation(
      parseArray(req.body.education, resume?.education || [])
    );

    const certificates = normalizeCertificates(
      parseArray(req.body.certificates, resume?.certificates || [])
    );

    const skills = normalizeSkills(
      parseArray(req.body.skills, resume?.skills || [])
    );

    const languages = normalizeLanguages(
      parseArray(req.body.languages, resume?.languages || [])
    );

    // =======================================
    // RESUME DATA
    // =======================================

    const resumeData = {
      fullName: normalizeText(req.body.fullName),
      title: normalizeText(req.body.title),
      bio: normalizeText(req.body.bio),
      email: normalizeText(req.body.email),
      phone: normalizeText(req.body.phone),
      location: normalizeText(req.body.location),
      website: normalizeText(req.body.website),
      github: normalizeText(req.body.github),
      linkedin: normalizeText(req.body.linkedin),

      skills,
      experience,
      education,
      certificates,
      languages,
    };

    // =======================================
    // CREATE
    // =======================================

    if (!resume) {
      resume = await Resume.create(resumeData);
    }

    // =======================================
    // UPDATE
    // =======================================

    else {
      resume = await Resume.findByIdAndUpdate(
        resume._id,
        {
          $set: resumeData,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Resume saved successfully.",
      resume,
    });
  } catch (error) {
    console.error("SAVE RESUME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// DELETE RESUME
// =======================================

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    await Resume.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE RESUME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getResume,
  saveResume,
  deleteResume,
};
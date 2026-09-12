const Resume = require("../models/Resume");

// =======================================
// GET RESUME
// =======================================

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne();

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
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

    // Resume collection fields must always end up as real arrays.
    // The frontend sends arrays, but this also safely supports older records
    // or clients that may send a JSON string. Never call JSON.parse() on an
    // already-created JavaScript object/array.
    const parseArray = (value, fallback = []) => {
      // Resume collections are sent as JSON arrays by the frontend.
      return Array.isArray(value) ? value : fallback;
    };

    const normalizeText = (value) => {
      if (value === undefined || value === null) return value;

      return String(value)
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim();
    };

    const normalizeExperience = (items) =>
      items.map((item = {}) => ({
        company: normalizeText(item.company),
        position: normalizeText(item.position),
        period: normalizeText(item.period),
        description: normalizeText(item.description),
      }));

    const normalizeEducation = (items) =>
      items.map((item = {}) => ({
        school: normalizeText(item.school),
        qualification: normalizeText(item.qualification),
        period: normalizeText(item.period),
      }));

    const normalizeCertificates = (items) =>
      items.map((item = {}) => ({
        name: normalizeText(item.name),
        issuer: normalizeText(item.issuer),
        year: normalizeText(item.year),
      }));

    const normalizeLanguages = (items) =>
      items.map((item = {}) => ({
        name: normalizeText(item.name),
        level: normalizeText(item.level),
      }));

    const experience = normalizeExperience(
      parseArray(req.body.experience, resume?.experience || [])
    );

    const education = normalizeEducation(
      parseArray(req.body.education, resume?.education || [])
    );

    const certificates = normalizeCertificates(
      parseArray(req.body.certificates, resume?.certificates || [])
    );

    const languages = normalizeLanguages(
      parseArray(req.body.languages, resume?.languages || [])
    );

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
      experience,
      education,
      certificates,
      languages,
    };

    if (!resume) {
      resume = await Resume.create(resumeData);
    } else {
      resume = await Resume.findByIdAndUpdate(
        resume._id,
        { $set: resumeData },
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

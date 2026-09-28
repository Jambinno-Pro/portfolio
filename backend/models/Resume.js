const mongoose = require("mongoose");

// ===============================
// Experience Schema
// ===============================
const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  period: String,
  description: String,
});

// ===============================
// Education Schema
// ===============================
const educationSchema = new mongoose.Schema({
  school: String,
  qualification: String,
  period: String,
});

// ===============================
// Certificate Schema
// ===============================
const certificateSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  year: String,
});

// ===============================
// Professional Skill Schema
// ===============================
const skillSchema = new mongoose.Schema({
  name: String,
  level: String,
});

// ===============================
// Language Schema
// ===============================
const languageSchema = new mongoose.Schema({
  name: String,
  level: String,
});

// ===============================
// Resume Schema
// ===============================
const resumeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    bio: String,

    email: String,

    phone: String,

    location: String,

    website: String,

    github: String,

    linkedin: String,

    // Professional Skills
    skills: [skillSchema],

    // Work Experience
    experience: [experienceSchema],

    // Education
    education: [educationSchema],

    // Certificates
    certificates: [certificateSchema],

    // Languages
    languages: [languageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
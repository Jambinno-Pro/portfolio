const Project = require("../models/Project");
const cloudinary = require("../config/cloudinary");

/* ===========================
   NORMALIZE TECHNOLOGIES
=========================== */

const normalizeTechnologies = (technologies) => {
  if (!technologies) {
    return [];
  }

  // Already an array
  if (Array.isArray(technologies)) {
    return technologies
      .map((tech) => String(tech).trim())
      .filter(Boolean);
  }

  // JSON string array
  if (typeof technologies === "string") {
    try {
      const parsed = JSON.parse(technologies);

      if (Array.isArray(parsed)) {
        return parsed
          .map((tech) => String(tech).trim())
          .filter(Boolean);
      }
    } catch (error) {
      // Not JSON - continue below
    }

    // Comma-separated string
    return technologies
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);
  }

  return [];
};


/* ===========================
   UPLOAD IMAGE TO CLOUDINARY
=========================== */

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio/projects",
        resource_type: "image",
      },

      (error, result) => {

        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};


/* ===========================
   GET ALL PROJECTS
=========================== */

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });

  } catch (error) {

    console.error("GET PROJECTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ===========================
   GET SINGLE PROJECT
=========================== */

exports.getProject = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });

  } catch (error) {

    console.error("GET PROJECT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ===========================
   CREATE PROJECT
=========================== */

exports.createProject = async (req, res) => {
  try {

    console.log("CREATE PROJECT BODY:", req.body);

    /* ===========================
       UPLOAD IMAGE
    =========================== */

    if (req.file) {

      const uploadedImage =
        await uploadToCloudinary(req.file.buffer);

      req.body.image = uploadedImage.secure_url;

      console.log(
        "CLOUDINARY IMAGE:",
        uploadedImage.secure_url
      );
    }

    /* ===========================
       PROJECT DATA
    =========================== */

    const projectData = {
      ...req.body,

      technologies: normalizeTechnologies(
        req.body.technologies
      ),
    };

    console.log(
      "TECHNOLOGIES RECEIVED:",
      projectData.technologies
    );

    /* ===========================
       CREATE PROJECT
    =========================== */

    const project =
      await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });

  } catch (error) {

    console.error(
      "CREATE PROJECT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ===========================
   UPDATE PROJECT
=========================== */

exports.updateProject = async (req, res) => {
  try {

    const project =
      await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    console.log(
      "UPDATE PROJECT BODY:",
      req.body
    );

    /* ===========================
       UPLOAD NEW IMAGE
    =========================== */

    if (req.file) {

      const uploadedImage =
        await uploadToCloudinary(req.file.buffer);

      req.body.image =
        uploadedImage.secure_url;

      console.log(
        "NEW CLOUDINARY IMAGE:",
        uploadedImage.secure_url
      );
    }

    /* ===========================
       PROJECT DATA
    =========================== */

    const projectData = {
      ...req.body,

      technologies: normalizeTechnologies(
        req.body.technologies
      ),
    };

    console.log(
      "UPDATED TECHNOLOGIES:",
      projectData.technologies
    );

    /* ===========================
       UPDATE PROJECT
    =========================== */

    const updatedProject =
      await Project.findByIdAndUpdate(
        req.params.id,
        projectData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });

  } catch (error) {

    console.error(
      "UPDATE PROJECT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ===========================
   DELETE PROJECT
=========================== */

exports.deleteProject = async (req, res) => {
  try {

    const project =
      await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE PROJECT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
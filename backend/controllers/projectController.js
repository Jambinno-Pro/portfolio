const Project = require("../models/Project");

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

    if (req.file) {
      req.body.image = `/uploads/projects/${req.file.filename}`;
    }

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

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

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
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    console.log("UPDATE PROJECT BODY:", req.body);

    if (req.file) {
      req.body.image = `/uploads/projects/${req.file.filename}`;
    }

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
    console.error("UPDATE PROJECT ERROR:", error);

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
    const project = await Project.findById(
      req.params.id
    );

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
    console.error("DELETE PROJECT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
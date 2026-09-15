const Project = require("../models/Project");

const {
  uploadImageToGitHub,
  deleteImageFromGitHub,
} = require("../utils/githubUpload");

/* ======================================================
   GENERATE PROJECT SLUG
====================================================== */

const generateProjectSlug = (title) => {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

/* ======================================================
   NORMALIZE TECHNOLOGIES
====================================================== */

const normalizeTechnologies = (technologies) => {
  if (!technologies) {
    return [];
  }

  if (Array.isArray(technologies)) {
    return technologies.map((tech) => String(tech).trim()).filter(Boolean);
  }

  if (typeof technologies === "string") {
    try {
      const parsed = JSON.parse(technologies);

      if (Array.isArray(parsed)) {
        return parsed.map((tech) => String(tech).trim()).filter(Boolean);
      }
    } catch (error) {
      // Continue with comma-separated format
    }

    return technologies
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);
  }

  return [];
};

/* ======================================================
   GENERATE SAFE FILE NAME
====================================================== */

const generateFileName = (originalName) => {
  const extension = originalName.includes(".")
    ? originalName.substring(originalName.lastIndexOf(".")).toLowerCase()
    : "";

  const baseName = originalName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${baseName || "project-image"}-${Date.now()}${extension}`;
};

/* ======================================================
   EXTRACT GITHUB FILE PATH FROM URL
====================================================== */

const getGitHubFilePath = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return null;
  }

  const prefix = "https://raw.githubusercontent.com/";

  if (!imageUrl.startsWith(prefix)) {
    return null;
  }

  const remaining = imageUrl.substring(prefix.length);
  const parts = remaining.split("/");

  /*
    Expected:

    owner
    repo
    branch
    projects
    project-slug
    image-file
  */

  if (parts.length < 6) {
    return null;
  }

  return parts.slice(3).join("/");
};

/* ======================================================
   BUILD PROJECT DATA
====================================================== */

const buildProjectData = (req) => {
  return {
    title: typeof req.body.title === "string" ? req.body.title.trim() : "",

    description:
      typeof req.body.description === "string"
        ? req.body.description.trim()
        : "",

    category:
      typeof req.body.category === "string"
        ? req.body.category
        : "Web Development",

    technologies: normalizeTechnologies(req.body.technologies),

    github: typeof req.body.github === "string" ? req.body.github.trim() : "",

    liveDemo:
      typeof req.body.liveDemo === "string" ? req.body.liveDemo.trim() : "",

    status: typeof req.body.status === "string" ? req.body.status : "Active",

    featured: req.body.featured === true || req.body.featured === "true",
  };
};

/* ======================================================
   GET ALL PROJECTS
====================================================== */

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

/* ======================================================
   GET SINGLE PROJECT
====================================================== */

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

/* ======================================================
   CREATE PROJECT
====================================================== */

exports.createProject = async (req, res) => {
  try {
    console.log("========================================");
    console.log("CREATE PROJECT");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file ? req.file.originalname : "No image");
    console.log("========================================");

    const projectData = buildProjectData(req);

    /* ==================================================
       GENERATE PERMANENT SLUG
    ================================================== */

    const slug = generateProjectSlug(projectData.title);

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "A valid project title is required.",
      });
    }

    /* ==================================================
       CHECK SLUG DUPLICATE
    ================================================== */

    const existingProject = await Project.findOne({
      slug,
    });

    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: "A project with this title already exists.",
      });
    }

    projectData.slug = slug;

    console.log("PROJECT SLUG:", projectData.slug);

    console.log("PROJECT GITHUB FOLDER:", `projects/${projectData.slug}`);

    /* ==================================================
       UPLOAD MAIN PROJECT IMAGE
    ================================================== */

    if (req.file) {
      const fileName = generateFileName(req.file.originalname);

      const uploadedImage = await uploadImageToGitHub({
        buffer: req.file.buffer,
        fileName,
        folder: `projects/${projectData.slug}`,
      });

      projectData.image = uploadedImage.url;

      console.log("MAIN PROJECT IMAGE UPLOADED:", uploadedImage.url);
    } else {
      projectData.image = "";
    }

    /* ==================================================
       CREATE PROJECT IN MONGODB
    ================================================== */

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

/* ======================================================
   UPDATE PROJECT
====================================================== */

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    console.log("========================================");
    console.log("UPDATE PROJECT");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file ? req.file.originalname : "No new image");
    console.log("========================================");

    const projectData = buildProjectData(req);

    /* ==================================================
       KEEP PERMANENT SLUG
    ================================================== */

    const projectSlug = project.slug;

    if (!projectSlug) {
      return res.status(400).json({
        success: false,
        message:
          "This project does not have a slug. Please migrate existing projects first.",
      });
    }

    projectData.slug = projectSlug;

    console.log("PROJECT SLUG:", projectSlug);

    console.log("PROJECT GITHUB FOLDER:", `projects/${projectSlug}`);

    /* ==================================================
       UPLOAD NEW MAIN IMAGE
    ================================================== */

    if (req.file) {
      const fileName = generateFileName(req.file.originalname);

      const uploadedImage = await uploadImageToGitHub({
        buffer: req.file.buffer,
        fileName,
        folder: `projects/${projectSlug}`,
      });

      projectData.image = uploadedImage.url;

      console.log("NEW MAIN PROJECT IMAGE UPLOADED:", uploadedImage.url);

      /* ================================================
         DELETE OLD MAIN IMAGE
      ================================================ */

      const oldFilePath = getGitHubFilePath(project.image);

      if (oldFilePath) {
        try {
          await deleteImageFromGitHub(oldFilePath);

          console.log("OLD MAIN PROJECT IMAGE DELETED:", oldFilePath);
        } catch (deleteError) {
          console.error("OLD MAIN IMAGE DELETE ERROR:", deleteError.message);
        }
      }
    } else {
      /* ================================================
         KEEP EXISTING IMAGE
      ================================================ */

      projectData.image = project.image || "";
    }

    /* ==================================================
       UPDATE PROJECT IN MONGODB
    ================================================== */

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      {
        new: true,
        runValidators: true,
      },
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

/* ======================================================
   DELETE PROJECT
====================================================== */

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    /* ==================================================
       DELETE MAIN IMAGE FROM GITHUB
    ================================================== */

    const filePath = getGitHubFilePath(project.image);

    if (filePath) {
      try {
        await deleteImageFromGitHub(filePath);

        console.log("MAIN PROJECT IMAGE DELETED:", filePath);
      } catch (deleteError) {
        console.error("MAIN PROJECT IMAGE DELETE ERROR:", deleteError.message);
      }
    }

    /* ==================================================
       DELETE PROJECT FROM MONGODB
    ================================================== */

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

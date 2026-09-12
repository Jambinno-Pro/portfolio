const Project = require("../models/Project");
const supabase = require("../config/supabase");

/* ===========================
   SUPABASE BUCKET
=========================== */

const PROJECT_BUCKET = "inno-project-images";


/* ===========================
   NORMALIZE TECHNOLOGIES
=========================== */

const normalizeTechnologies = (technologies) => {

  if (!technologies) {
    return [];
  }

  if (Array.isArray(technologies)) {

    return technologies
      .map((tech) => String(tech).trim())
      .filter(Boolean);

  }

  if (typeof technologies === "string") {

    try {

      const parsed = JSON.parse(technologies);

      if (Array.isArray(parsed)) {

        return parsed
          .map((tech) => String(tech).trim())
          .filter(Boolean);

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


/* ===========================
   GENERATE FILE NAME
=========================== */

const generateFileName = (originalName) => {

  const extension =
    originalName.includes(".")
      ? originalName.substring(
          originalName.lastIndexOf(".")
        )
      : "";

  return `${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}${extension}`;
};


/* ===========================
   UPLOAD IMAGE TO SUPABASE
=========================== */

const uploadImageToSupabase = async (file) => {

  if (!file) {
    return null;
  }

  const fileName =
    generateFileName(file.originalname);

  const filePath =
    `projects/${fileName}`;

  const { error } =
    await supabase.storage
      .from(PROJECT_BUCKET)
      .upload(
        filePath,
        file.buffer,
        {
          contentType: file.mimetype,
          upsert: false,
        }
      );

  if (error) {
    throw new Error(
      `Supabase upload failed: ${error.message}`
    );
  }

  const { data } =
    supabase.storage
      .from(PROJECT_BUCKET)
      .getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
};


/* ===========================
   DELETE SUPABASE IMAGE
=========================== */

const deleteImageFromSupabase = async (imageUrl) => {

  if (!imageUrl) {
    return;
  }

  // Only delete files belonging to our
  // Supabase project-images bucket.

  if (!imageUrl.includes(PROJECT_BUCKET)) {
    return;
  }

  try {

    const marker =
      `/storage/v1/object/public/${PROJECT_BUCKET}/`;

    const index =
      imageUrl.indexOf(marker);

    if (index === -1) {
      return;
    }

    const filePath =
      imageUrl.substring(
        index + marker.length
      );

    if (!filePath) {
      return;
    }

    const { error } =
      await supabase.storage
        .from(PROJECT_BUCKET)
        .remove([filePath]);

    if (error) {

      console.error(
        "SUPABASE IMAGE DELETE ERROR:",
        error.message
      );

    }

  } catch (error) {

    console.error(
      "SUPABASE IMAGE DELETE ERROR:",
      error.message
    );

  }

};


/* ===========================
   GET ALL PROJECTS
=========================== */

exports.getProjects = async (req, res) => {

  try {

    const projects =
      await Project.find().sort({
        createdAt: -1,
      });

    res.status(200).json({

      success: true,

      count: projects.length,

      projects,

    });

  } catch (error) {

    console.error(
      "GET PROJECTS ERROR:",
      error
    );

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

    const project =
      await Project.findById(req.params.id);

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

    console.error(
      "GET PROJECT ERROR:",
      error
    );

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

    console.log(
      "CREATE PROJECT BODY:",
      req.body
    );

    /* ===========================
       IMAGE
    =========================== */

    let imageUrl = req.body.image || "";

    if (req.file) {

      const uploadedImage =
        await uploadImageToSupabase(
          req.file
        );

      imageUrl =
        uploadedImage.url;

    }

    /* ===========================
       PROJECT DATA
    =========================== */

    const projectData = {

      ...req.body,

      image: imageUrl,

      technologies:
        normalizeTechnologies(
          req.body.technologies
        ),

    };

    console.log(
      "PROJECT DATA:",
      projectData
    );

    /* ===========================
       CREATE
    =========================== */

    const project =
      await Project.create(projectData);

    res.status(201).json({

      success: true,

      message:
        "Project created successfully",

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
      await Project.findById(
        req.params.id
      );

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
       PROJECT DATA
    =========================== */

    const projectData = {

      ...req.body,

      technologies:
        normalizeTechnologies(
          req.body.technologies
        ),

    };


    /* ===========================
       NEW IMAGE
    =========================== */

    if (req.file) {

      const uploadedImage =
        await uploadImageToSupabase(
          req.file
        );

      projectData.image =
        uploadedImage.url;

      // Delete old Supabase image
      // after successful new upload.

      await deleteImageFromSupabase(
        project.image
      );

    }


    /* ===========================
       UPDATE
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

      message:
        "Project updated successfully",

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
      await Project.findById(
        req.params.id
      );

    if (!project) {

      return res.status(404).json({

        success: false,

        message: "Project not found",

      });

    }

    /* ===========================
       DELETE SUPABASE IMAGE
    =========================== */

    await deleteImageFromSupabase(
      project.image
    );


    /* ===========================
       DELETE PROJECT
    =========================== */

    await project.deleteOne();

    res.status(200).json({

      success: true,

      message:
        "Project deleted successfully",

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
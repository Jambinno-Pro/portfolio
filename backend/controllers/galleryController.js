const Gallery = require("../models/Gallery");
const Project = require("../models/Project");

const {
  uploadImageToGitHub,
  deleteImageFromGitHub,
} = require("../utils/githubUpload");

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

  return `${baseName || "gallery-image"}-${Date.now()}${extension}`;
};

/* ======================================================
   EXTRACT GITHUB FILE PATH
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
   GET ALL GALLERY ITEMS
====================================================== */

exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find()
      .populate("project", "title slug category")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: gallery.length,
      gallery,
    });
  } catch (error) {
    console.error("GET GALLERY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET GALLERY ITEMS FOR A PROJECT
====================================================== */

exports.getProjectGallery = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const gallery = await Gallery.find({
      project: project._id,
      status: "Active",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: gallery.length,
      project: {
        _id: project._id,
        title: project.title,
        slug: project.slug,
        category: project.category,
      },
      gallery,
    });
  } catch (error) {
    console.error("GET PROJECT GALLERY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET SINGLE GALLERY ITEM
====================================================== */

exports.getGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id).populate(
      "project",
      "title slug category",
    );

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).json({
      success: true,
      galleryItem,
    });
  } catch (error) {
    console.error("GET GALLERY ITEM ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   CREATE GALLERY ITEM
====================================================== */

exports.createGallery = async (req, res) => {
  try {
    console.log("========================================");
    console.log("CREATE GALLERY ITEM");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file ? req.file.originalname : "No image");
    console.log("========================================");

    /* ==================================================
       CHECK IMAGE
    ================================================== */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Gallery image is required.",
      });
    }

    /* ==================================================
       CHECK PROJECT
    ================================================== */

    const projectId = req.body.project;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project is required.",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Selected project was not found.",
      });
    }

    /* ==================================================
       CHECK PROJECT SLUG
    ================================================== */

    if (!project.slug) {
      return res.status(400).json({
        success: false,
        message:
          "This project does not have a slug. Please migrate existing projects first.",
      });
    }

    /* ==================================================
       PROJECT GITHUB FOLDER
    ================================================== */

    const githubFolder = `projects/${project.slug}`;

    console.log("PROJECT GITHUB FOLDER:", githubFolder);

    /* ==================================================
       GENERATE FILE NAME
    ================================================== */

    const fileName = generateFileName(req.file.originalname);

    /* ==================================================
       UPLOAD IMAGE TO GITHUB
    ================================================== */

    const uploadedImage = await uploadImageToGitHub({
      buffer: req.file.buffer,
      fileName,
      folder: githubFolder,
    });

    console.log("GITHUB PROJECT GALLERY IMAGE UPLOADED:", uploadedImage.url);

    /* ==================================================
       SAVE GALLERY DATA TO MONGODB
    ================================================== */

    const galleryItem = await Gallery.create({
      project: project._id,

      title: typeof req.body.title === "string" ? req.body.title.trim() : "",

      description:
        typeof req.body.description === "string"
          ? req.body.description.trim()
          : "",

      category:
        typeof req.body.category === "string"
          ? req.body.category.trim()
          : "General",

      status: typeof req.body.status === "string" ? req.body.status : "Active",

      image: uploadedImage.url,
    });

    res.status(201).json({
      success: true,
      message: "Project gallery image created successfully",
      galleryItem,
    });
  } catch (error) {
    console.error("CREATE GALLERY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   UPDATE GALLERY ITEM
====================================================== */

exports.updateGallery = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    /* ==================================================
       DETERMINE PROJECT
    ================================================== */

    const projectId = req.body.project || galleryItem.project;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Selected project was not found.",
      });
    }

    /* ==================================================
       CHECK PROJECT SLUG
    ================================================== */

    if (!project.slug) {
      return res.status(400).json({
        success: false,
        message:
          "This project does not have a slug. Please migrate existing projects first.",
      });
    }

    /* ==================================================
       PREVENT PROJECT CHANGE WITHOUT IMAGE
    ================================================== */

    const originalProjectId = galleryItem.project?.toString();

    const newProjectId = project._id.toString();

    const projectChanged = originalProjectId !== newProjectId;

    if (projectChanged && !req.file) {
      return res.status(400).json({
        success: false,
        message:
          "A new image is required when moving a gallery item to another project.",
      });
    }

    let imageUrl = galleryItem.image;

    /* ==================================================
       REPLACE IMAGE
    ================================================== */

    if (req.file) {
      const githubFolder = `projects/${project.slug}`;

      const fileName = generateFileName(req.file.originalname);

      const uploadedImage = await uploadImageToGitHub({
        buffer: req.file.buffer,
        fileName,
        folder: githubFolder,
      });

      imageUrl = uploadedImage.url;

      console.log("NEW GITHUB PROJECT GALLERY IMAGE:", imageUrl);

      /* ================================================
         DELETE OLD IMAGE
      ================================================ */

      const oldFilePath = getGitHubFilePath(galleryItem.image);

      if (oldFilePath) {
        try {
          await deleteImageFromGitHub(oldFilePath);

          console.log("OLD GALLERY IMAGE DELETED:", oldFilePath);
        } catch (deleteError) {
          console.error("OLD GALLERY IMAGE DELETE ERROR:", deleteError.message);
        }
      }
    }

    /* ==================================================
       UPDATE MONGODB DATA
    ================================================== */

    galleryItem.project = project._id;

    galleryItem.title =
      typeof req.body.title === "string"
        ? req.body.title.trim()
        : galleryItem.title;

    galleryItem.description =
      typeof req.body.description === "string"
        ? req.body.description.trim()
        : galleryItem.description;

    galleryItem.category =
      typeof req.body.category === "string"
        ? req.body.category.trim()
        : galleryItem.category;

    galleryItem.status =
      typeof req.body.status === "string"
        ? req.body.status
        : galleryItem.status;

    galleryItem.image = imageUrl;

    const updatedGalleryItem = await galleryItem.save();

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      galleryItem: updatedGalleryItem,
    });
  } catch (error) {
    console.error("UPDATE GALLERY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   DELETE GALLERY ITEM
====================================================== */

exports.deleteGallery = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    /* ==================================================
       DELETE IMAGE FROM GITHUB
    ================================================== */

    const filePath = getGitHubFilePath(galleryItem.image);

    if (filePath) {
      try {
        await deleteImageFromGitHub(filePath);

        console.log("GALLERY IMAGE DELETED FROM GITHUB:", filePath);
      } catch (deleteError) {
        console.error("GALLERY GITHUB DELETE ERROR:", deleteError.message);
      }
    }

    /* ==================================================
       DELETE MONGODB RECORD
    ================================================== */

    await galleryItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("DELETE GALLERY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

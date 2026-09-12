const About = require("../models/About");

/* ===========================
   GET ABOUT
=========================== */

exports.getAbout = async (req, res) => {
  try {

    const about = await About.findOne();

    res.status(200).json({
      success: true,
      about,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ===========================
   GET SINGLE ABOUT
=========================== */

exports.getAboutById = async (req, res) => {
  try {

    const about = await About.findById(req.params.id);

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About information not found",
      });
    }

    res.status(200).json({
      success: true,
      about,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ===========================
   CREATE ABOUT
=========================== */

exports.createAbout = async (req, res) => {

  try {

    const exists = await About.findOne();

    if (exists) {

      return res.status(400).json({
        success: false,
        message: "About profile already exists. Please edit it instead.",
      });

    }

    const aboutData = {
      ...req.body,
    };

    // Profile Image
    if (req.files && req.files.image) {

      aboutData.image =
        "/uploads/about/" +
        req.files.image[0].filename;

    }

    // Resume PDF
    if (req.files && req.files.resume) {

      aboutData.resume =
        "/uploads/resume/" +
        req.files.resume[0].filename;

    }

    const about = await About.create(aboutData);

    res.status(201).json({
      success: true,
      message: "About profile created successfully",
      about,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/* ===========================
   UPDATE ABOUT
=========================== */

exports.updateAbout = async (req, res) => {

  try {

    const about = await About.findById(req.params.id);

    if (!about) {

      return res.status(404).json({
        success: false,
        message: "About profile not found",
      });

    }

    const updateData = {
      ...req.body,
    };

    // Replace Image
    if (req.files && req.files.image) {

      updateData.image =
        "/uploads/about/" +
        req.files.image[0].filename;

    }

    // Replace Resume
    if (req.files && req.files.resume) {

      updateData.resume =
        "/uploads/resume/" +
        req.files.resume[0].filename;

    }

    const updatedAbout = await About.findByIdAndUpdate(

      req.params.id,

      updateData,

      {
        new: true,
        runValidators: true,
      }

    );

    res.status(200).json({

      success: true,

      message: "About profile updated successfully",

      about: updatedAbout,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

/* ===========================
   DELETE ABOUT
=========================== */

exports.deleteAbout = async (req, res) => {

  try {

    const about = await About.findById(req.params.id);

    if (!about) {

      return res.status(404).json({

        success: false,

        message: "About profile not found",

      });

    }

    await about.deleteOne();

    res.status(200).json({

      success: true,

      message: "About profile deleted successfully",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
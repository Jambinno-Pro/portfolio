const Resume = require("../models/Resume");

// =======================================
// GET RESUME
// =======================================

const getResume = async (req, res) => {
  try {

    const resume = await Resume.findOne();

    res.status(200).json({
      success: true,
      resume,
    });

  } catch (error) {

    console.error(
      "GET RESUME ERROR:",
      error
    );

    res.status(500).json({
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

    console.log(
      "RESUME BODY:",
      req.body
    );

    console.log(
      "RESUME FILE:",
      req.file
    );


    let resume = await Resume.findOne();


    // ===================================
    // PREPARE DATA
    // ===================================

    const resumeData = {

      fullName: req.body.fullName,

      title: req.body.title,

      bio: req.body.bio,

      email: req.body.email,

      phone: req.body.phone,

      location: req.body.location,

      website: req.body.website,

      github: req.body.github,

      linkedin: req.body.linkedin,

      experience: req.body.experience
        ? JSON.parse(req.body.experience)
        : [],

      education: req.body.education
        ? JSON.parse(req.body.education)
        : [],

      certificates: req.body.certificates
        ? JSON.parse(req.body.certificates)
        : [],

      languages: req.body.languages
        ? JSON.parse(req.body.languages)
        : [],

    };


    // ===================================
    // CV UPLOAD
    // ===================================

    if (req.file) {

      resumeData.cv =
        `/uploads/resume/${req.file.filename}`;

    }


    // ===================================
    // CREATE
    // ===================================

    if (!resume) {

      resume = await Resume.create(
        resumeData
      );

    }


    // ===================================
    // UPDATE
    // ===================================

    else {

      resume = await Resume.findByIdAndUpdate(

        resume._id,

        resumeData,

        {
          new: true,
          runValidators: true,
        }

      );

    }


    // ===================================
    // RESPONSE
    // ===================================

    res.status(200).json({

      success: true,

      message:
        "Resume saved successfully.",

      resume,

    });

  } catch (error) {

    console.error(
      "SAVE RESUME ERROR:",
      error
    );

    res.status(500).json({

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

    const resume =
      await Resume.findById(
        req.params.id
      );


    if (!resume) {

      return res.status(404).json({

        success: false,

        message:
          "Resume not found.",

      });

    }


    await Resume.findByIdAndDelete(
      req.params.id
    );


    res.status(200).json({

      success: true,

      message:
        "Resume deleted successfully.",

    });

  } catch (error) {

    console.error(
      "DELETE RESUME ERROR:",
      error
    );

    res.status(500).json({

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
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

    let resume = await Resume.findOne();

    if (!resume) {

      resume = await Resume.create(req.body);

    } else {

      resume = await Resume.findByIdAndUpdate(
        resume._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    }

    res.status(200).json({
      success: true,
      message: "Resume saved successfully.",
      resume,
    });

  } catch (error) {

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

    const resume = await Resume.findById(req.params.id);

    if (!resume) {

      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });

    }

    await Resume.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });

  } catch (error) {

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
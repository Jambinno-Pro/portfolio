const Message = require("../models/Message");

// =======================================
// CREATE MESSAGE
// =======================================

const createMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    // Check required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, subject and message are required.",
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      data: newMessage,
    });

  } catch (error) {

    console.error("Create message error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to send message.",
      error: error.message,
    });

  }
};

// =======================================
// GET ALL MESSAGES
// =======================================

const getMessages = async (req, res) => {
  try {

    const messages = await Message.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (error) {

    console.error("Get messages error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve messages.",
      error: error.message,
    });

  }
};

// =======================================
// GET SINGLE MESSAGE
// =======================================

const getMessage = async (req, res) => {
  try {

    const message = await Message.findById(
      req.params.id
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.status(200).json({
      success: true,
      message,
    });

  } catch (error) {

    console.error("Get message error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve message.",
      error: error.message,
    });

  }
};

// =======================================
// UPDATE MESSAGE STATUS
// =======================================

const updateMessageStatus = async (req, res) => {
  try {

    const { status } = req.body;

    if (!["New", "Read", "Replied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message status.",
      });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message status updated.",
      data: message,
    });

  } catch (error) {

    console.error(
      "Update message status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to update message.",
      error: error.message,
    });

  }
};

// =======================================
// DELETE MESSAGE
// =======================================

const deleteMessage = async (req, res) => {
  try {

    const message = await Message.findById(
      req.params.id
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    await Message.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });

  } catch (error) {

    console.error(
      "Delete message error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete message.",
      error: error.message,
    });

  }
};

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
};
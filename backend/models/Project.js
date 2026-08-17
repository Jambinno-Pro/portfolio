const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

category: {
  type: String,
  enum: [
    "Web Development",
    "Frontend",
    "Backend",
    "Full Stack",
    "WordPress",
    "Graphic Design",
    "Application",
    "Database",
  ],
  default: "Web Development",
},

    image: {
      type: String,
      default: "",
    },

    technologies: [
      {
        type: String,
      },
    ],

    github: {
      type: String,
      default: "",
    },

    liveDemo: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
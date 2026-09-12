const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Database",
        "Mobile",
        "Design",
        "Tools",
        "DevOps",
        "Other",
      ],
      default: "Frontend",
    },

    level: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    icon: {
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

module.exports = mongoose.model("Skill", skillSchema);
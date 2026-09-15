const mongoose = require("mongoose");
require("dotenv").config();

const Project = require("../models/Project");

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
   MIGRATE PROJECT SLUGS
====================================================== */

const migrateProjectSlugs = async () => {
  try {
    console.log("========================================");
    console.log("PROJECT SLUG MIGRATION");
    console.log("========================================");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    const projects = await Project.find();

    console.log(`Found ${projects.length} project(s).`);

    const usedSlugs = new Set();

    for (const project of projects) {
      /* ------------------------------------------
         KEEP EXISTING SLUG
      ------------------------------------------ */

      if (project.slug) {
        usedSlugs.add(project.slug);

        console.log(`✓ ${project.title} already has slug: ${project.slug}`);

        continue;
      }

      /* ------------------------------------------
         GENERATE SLUG
      ------------------------------------------ */

      let baseSlug = generateProjectSlug(project.title);

      if (!baseSlug) {
        console.log(
          `⚠️ Skipping "${project.title}" — could not generate slug.`,
        );

        continue;
      }

      let slug = baseSlug;
      let counter = 2;

      /* ------------------------------------------
         HANDLE DUPLICATE SLUGS
      ------------------------------------------ */

      while (
        usedSlugs.has(slug) ||
        (await Project.exists({
          slug,
          _id: { $ne: project._id },
        }))
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      /* ------------------------------------------
         SAVE SLUG
      ------------------------------------------ */

      project.slug = slug;

      await project.save();

      usedSlugs.add(slug);

      console.log(`✓ ${project.title} → ${slug}`);
    }

    console.log("");
    console.log("========================================");
    console.log("MIGRATION COMPLETE");
    console.log("========================================");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("❌ MIGRATION FAILED");
    console.error(error);

    process.exit(1);
  }
};

migrateProjectSlugs();

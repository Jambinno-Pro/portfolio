import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaExternalLinkAlt,
  FaGithub,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "../../styles/projects/ProjectCard.css";

import { getProjectImage } from "./projectImages";
import { getProjectGallery } from "../../services/galleryService";

function ProjectCard({ project }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  /* ======================================================
     PROJECT MAIN IMAGE
  ====================================================== */

  const imageUrl = getProjectImage(project);

  /* ======================================================
     LOAD PROJECT GALLERY
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadGallery = async () => {
      if (!project?._id) {
        setGallery(imageUrl ? [imageUrl] : []);
        return;
      }

      try {
        setGalleryLoading(true);

        const galleryItems = await getProjectGallery(project._id);

        if (cancelled) return;

        const galleryImages = galleryItems
          .map((item) => item?.image)
          .filter(Boolean);

        /*
          Always place the main project image first.

          If the same image already exists in Gallery,
          don't duplicate it.
        */

        const allImages = imageUrl
          ? [imageUrl, ...galleryImages.filter((image) => image !== imageUrl)]
          : galleryImages;

        setGallery(allImages);
        setActiveImage(0);
      } catch (error) {
        console.error("PROJECT GALLERY LOAD ERROR:", error);

        if (!cancelled) {
          setGallery(imageUrl ? [imageUrl] : []);
        }
      } finally {
        if (!cancelled) {
          setGalleryLoading(false);
        }
      }
    };

    loadGallery();

    return () => {
      cancelled = true;
    };
  }, [project?._id, imageUrl]);

  /* ======================================================
     TECHNOLOGIES
  ====================================================== */

  const technologies = Array.isArray(project?.technologies)
    ? project.technologies
    : typeof project?.technologies === "string"
      ? project.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean)
      : [];

  /* ======================================================
     WEBSITE URL
  ====================================================== */

  const websiteUrl = project?.website || project?.liveDemo;

  /* ======================================================
     MODAL BODY SCROLL LOCK
  ====================================================== */

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "ArrowLeft" && gallery.length > 1) {
        setActiveImage(
          (current) => (current - 1 + gallery.length) % gallery.length,
        );
      }

      if (event.key === "ArrowRight" && gallery.length > 1) {
        setActiveImage((current) => (current + 1) % gallery.length);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, gallery.length]);

  /* ======================================================
     OPEN / CLOSE MODAL
  ====================================================== */

  const openModal = () => {
    setActiveImage(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  /* ======================================================
     IMAGE NAVIGATION
  ====================================================== */

  const nextImage = () => {
    if (gallery.length <= 1) return;

    setActiveImage((current) => (current + 1) % gallery.length);
  };

  const previousImage = () => {
    if (gallery.length <= 1) return;

    setActiveImage(
      (current) => (current - 1 + gallery.length) % gallery.length,
    );
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <>
      <motion.article
        className="project-card"
        whileHover={{ y: -7 }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
      >
        {/* ==================================================
            FEATURED BADGE
        ================================================== */}

        {project?.featured && (
          <span className="featured-badge">★ Featured</span>
        )}

        {/* ==================================================
            MAIN PROJECT IMAGE
        ================================================== */}

        <div className="project-image-wrap">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project?.title || "Project"}
              className="project-image"
            />
          ) : (
            <div
              className="project-image project-image-placeholder"
              aria-label="No project image available"
            >
              No image
            </div>
          )}

          {project?.category && (
            <span className="project-category">{project.category}</span>
          )}
        </div>

        {/* ==================================================
            MINI GALLERY
        ================================================== */}

        {!galleryLoading && gallery.length > 0 && (
          <div
            className="project-card-mini-gallery"
            aria-label={`${project?.title || "Project"} mini gallery`}
          >
            {gallery.map((galleryImage, index) => (
              <button
                type="button"
                key={`${
                  project?._id || project?.id || project?.title
                }-mini-${index}`}
                className={`mini-gallery-thumb ${
                  activeImage === index ? "active" : ""
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`View ${
                  project?.title || "project"
                } image ${index + 1}`}
                aria-pressed={activeImage === index}
              >
                <img src={galleryImage} alt="" />
              </button>
            ))}
          </div>
        )}

        {/* ==================================================
            CARD CONTENT
        ================================================== */}

        <div className="project-content">
          <h3>{project?.title}</h3>

          <button
            type="button"
            className="view-more-btn"
            onClick={openModal}
            aria-haspopup="dialog"
          >
            View More
          </button>
        </div>
      </motion.article>

      {/* ====================================================
          PROJECT MODAL
      ==================================================== */}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <motion.div
              className="project-modal"
              initial={{
                opacity: 0,
                y: 28,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              transition={{
                duration: 0.28,
                ease: "easeOut",
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`project-modal-title-${
                project?._id || project?.id
              }`}
            >
              {/* ==================================================
                  CLOSE BUTTON
              ================================================== */}

              <button
                type="button"
                className="project-modal-close"
                onClick={closeModal}
                aria-label="Close project details"
              >
                <FaTimes />
              </button>

              {/* ==================================================
                  MODAL HEADER
              ================================================== */}

              <div className="project-modal-header">
                <div>
                  <span className="project-modal-eyebrow">
                    Project Overview
                  </span>

                  <h2 id={`project-modal-title-${project?._id || project?.id}`}>
                    {project?.title}
                  </h2>
                </div>

                {project?.category && (
                  <span className="project-modal-category">
                    {project.category}
                  </span>
                )}
              </div>

              {/* ==================================================
                  MODAL BODY
              ================================================== */}

              <div className="project-modal-body">
                {/* ================================================
                    GALLERY COLUMN
                ================================================= */}

                <div className="project-gallery-column">
                  <div className="project-gallery-main">
                    {gallery.length > 0 ? (
                      <img
                        src={gallery[activeImage]}
                        alt={`${project?.title || "Project"} screenshot ${
                          activeImage + 1
                        }`}
                      />
                    ) : (
                      <div className="project-gallery-empty">
                        No project image available
                      </div>
                    )}

                    {gallery.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="gallery-arrow gallery-arrow-left"
                          onClick={previousImage}
                          aria-label="Previous screenshot"
                        >
                          <FaChevronLeft />
                        </button>

                        <button
                          type="button"
                          className="gallery-arrow gallery-arrow-right"
                          onClick={nextImage}
                          aria-label="Next screenshot"
                        >
                          <FaChevronRight />
                        </button>
                      </>
                    )}
                  </div>

                  {/* ==========================================
                      ALL GALLERY THUMBNAILS
                  ========================================== */}

                  {gallery.length > 0 && (
                    <div
                      className="project-gallery-thumbs"
                      aria-label="Project screenshots"
                    >
                      {gallery.map((galleryImage, index) => (
                        <button
                          type="button"
                          key={`${
                            project?._id || project?.id || project?.title
                          }-gallery-${index}`}
                          className={`gallery-thumb ${
                            activeImage === index ? "active" : ""
                          }`}
                          onClick={() => setActiveImage(index)}
                          aria-label={`View screenshot ${index + 1}`}
                          aria-pressed={activeImage === index}
                        >
                          <img
                            src={galleryImage}
                            alt={`${project?.title || "Project"} thumbnail ${
                              index + 1
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ==========================================
                      GALLERY COUNTER
                  ========================================== */}

                  {gallery.length > 0 && (
                    <span className="gallery-counter">
                      {activeImage + 1} / {gallery.length}
                    </span>
                  )}
                </div>

                {/* ================================================
                    PROJECT INFORMATION
                ================================================= */}

                <div className="project-overview-column">
                  <div className="project-detail-block">
                    <h4>Project Overview</h4>

                    <p>
                      {project?.description ||
                        "Project information is available on request."}
                    </p>
                  </div>

                  {/* ==========================================
                      TECHNOLOGIES
                  ========================================== */}

                  {technologies.length > 0 && (
                    <div className="project-detail-block">
                      <h4>Technologies</h4>

                      <div className="tech-stack">
                        {technologies.map((tech, index) => (
                          <span key={`${tech}-${index}`}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      PROJECT BUTTONS
                  ========================================== */}

                  <div className="project-buttons">
                    {websiteUrl && websiteUrl !== "#" && (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="visit-btn"
                      >
                        Visit Website
                        <FaExternalLinkAlt />
                      </a>
                    )}

                    {project?.github && project.github !== "#" && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="github-btn"
                      >
                        <FaGithub />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectCard;

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

  // Full-screen gallery viewer
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(0);

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
        setGallery(
          imageUrl
            ? [
                {
                  image: imageUrl,
                  description: "",
                },
              ]
            : [],
        );

        return;
      }

      try {
        setGalleryLoading(true);

        const galleryItems = await getProjectGallery(project._id);

        if (cancelled) return;

        /*
          Keep BOTH image and description.

          Previously only the image URL was kept,
          which meant the fullscreen viewer had
          no description to display.
        */

        const galleryObjects = galleryItems
          .map((item) => ({
            image: item?.image || "",
            description: item?.description || "",
          }))
          .filter((item) => item.image);

        /*
          Always place the main project image first.

          If the same image already exists in the
          Gallery collection, don't duplicate it.
        */

        const mainImage = imageUrl
          ? [
              {
                image: imageUrl,
                description: "",
              },
            ]
          : [];

        const additionalGalleryImages = galleryObjects.filter(
          (item) => item.image !== imageUrl,
        );

        const allGalleryImages = [...mainImage, ...additionalGalleryImages];

        setGallery(allGalleryImages);
        setActiveImage(0);
      } catch (error) {
        console.error("PROJECT GALLERY LOAD ERROR:", error);

        if (!cancelled) {
          setGallery(
            imageUrl
              ? [
                  {
                    image: imageUrl,
                    description: "",
                  },
                ]
              : [],
          );
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
     CLOSE FULLSCREEN GALLERY
  ====================================================== */

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  /* ======================================================
     OPEN FULLSCREEN GALLERY
  ====================================================== */

  const openLightbox = (index) => {
    if (!gallery.length) return;

    setLightboxImage(index);
    setLightboxOpen(true);
  };

  /* ======================================================
     FULLSCREEN NEXT IMAGE
  ====================================================== */

  const nextLightboxImage = () => {
    if (gallery.length <= 1) return;

    setLightboxImage((current) => (current + 1) % gallery.length);
  };

  /* ======================================================
     FULLSCREEN PREVIOUS IMAGE
  ====================================================== */

  const previousLightboxImage = () => {
    if (gallery.length <= 1) return;

    setLightboxImage(
      (current) => (current - 1 + gallery.length) % gallery.length,
    );
  };

  /* ======================================================
     MODAL BODY SCROLL LOCK
  ====================================================== */

  useEffect(() => {
    if (!isModalOpen && !lightboxOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      /*
        Fullscreen gallery gets keyboard priority.
      */

      if (lightboxOpen) {
        if (event.key === "Escape") {
          closeLightbox();
        }

        if (event.key === "ArrowLeft" && gallery.length > 1) {
          previousLightboxImage();
        }

        if (event.key === "ArrowRight" && gallery.length > 1) {
          nextLightboxImage();
        }

        return;
      }

      /*
        Normal project modal keyboard controls.
      */

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
  }, [isModalOpen, lightboxOpen, gallery.length]);

  /* ======================================================
     OPEN / CLOSE PROJECT MODAL
  ====================================================== */

  const openModal = () => {
    setActiveImage(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLightboxOpen(false);
  };

  /* ======================================================
     PROJECT GALLERY NAVIGATION
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
     CURRENT FULLSCREEN GALLERY ITEM
  ====================================================== */

  const currentLightboxItem = gallery[lightboxImage];

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <>
      {/* ==================================================
          PROJECT CARD
      ================================================== */}

      <motion.article
        className="project-card"
        whileHover={{ y: -7 }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
      >
        {/* FEATURED BADGE */}

        {project?.featured && (
          <span className="featured-badge">★ Featured</span>
        )}

        {/* MAIN PROJECT IMAGE */}

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

        {/* MINI GALLERY */}

        {!galleryLoading && gallery.length > 0 && (
          <div
            className="project-card-mini-gallery"
            aria-label={`${project?.title || "Project"} mini gallery`}
          >
            {gallery.map((galleryItem, index) => (
              <button
                type="button"
                key={`${
                  project?._id || project?.id || project?.title
                }-mini-${index}`}
                className={`mini-gallery-thumb ${
                  activeImage === index ? "active" : ""
                }`}
                onClick={() => {
                  setActiveImage(index);
                  openLightbox(index);
                }}
                aria-label={`Open ${
                  project?.title || "project"
                } image ${index + 1} fullscreen`}
                aria-pressed={activeImage === index}
              >
                <img src={galleryItem.image} alt="" />
              </button>
            ))}
          </div>
        )}

        {/* CARD CONTENT */}

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
          PROJECT DETAILS MODAL
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
              {/* CLOSE */}

              <button
                type="button"
                className="project-modal-close"
                onClick={closeModal}
                aria-label="Close project details"
              >
                <FaTimes />
              </button>

              {/* HEADER */}

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

              {/* BODY */}

              <div className="project-modal-body">
                {/* GALLERY */}

                <div className="project-gallery-column">
                  <div
                    className="project-gallery-main"
                    onClick={() => openLightbox(activeImage)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openLightbox(activeImage);
                      }
                    }}
                    aria-label="Open screenshot fullscreen"
                  >
                    {gallery.length > 0 ? (
                      <img
                        src={gallery[activeImage]?.image}
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
                          onClick={(event) => {
                            event.stopPropagation();
                            previousImage();
                          }}
                          aria-label="Previous screenshot"
                        >
                          <FaChevronLeft />
                        </button>

                        <button
                          type="button"
                          className="gallery-arrow gallery-arrow-right"
                          onClick={(event) => {
                            event.stopPropagation();
                            nextImage();
                          }}
                          aria-label="Next screenshot"
                        >
                          <FaChevronRight />
                        </button>
                      </>
                    )}

                    <span className="gallery-fullscreen-hint">
                      Click image to view fullscreen
                    </span>
                  </div>

                  {/* THUMBNAILS */}

                  {gallery.length > 0 && (
                    <div
                      className="project-gallery-thumbs"
                      aria-label="Project screenshots"
                    >
                      {gallery.map((galleryItem, index) => (
                        <button
                          type="button"
                          key={`${
                            project?._id || project?.id || project?.title
                          }-gallery-${index}`}
                          className={`gallery-thumb ${
                            activeImage === index ? "active" : ""
                          }`}
                          onClick={() => {
                            setActiveImage(index);

                            openLightbox(index);
                          }}
                          aria-label={`Open screenshot ${index + 1} fullscreen`}
                          aria-pressed={activeImage === index}
                        >
                          <img
                            src={galleryItem.image}
                            alt={`${project?.title || "Project"} thumbnail ${
                              index + 1
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* COUNTER */}

                  {gallery.length > 0 && (
                    <span className="gallery-counter">
                      {activeImage + 1} / {gallery.length}
                    </span>
                  )}
                </div>

                {/* PROJECT INFORMATION */}

                <div className="project-overview-column">
                  <div className="project-detail-block">
                    <h4>Project Overview</h4>

                    <p>
                      {project?.description ||
                        "Project information is available on request."}
                    </p>
                  </div>

                  {/* TECHNOLOGIES */}

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

                  {/* BUTTONS */}

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

      {/* ====================================================
          FULLSCREEN GALLERY LIGHTBOX
      ==================================================== */}

      <AnimatePresence>
        {lightboxOpen && currentLightboxItem && (
          <motion.div
            className="project-gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeLightbox();
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen project screenshot"
          >
            {/* CLOSE */}

            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close fullscreen image"
            >
              <FaTimes />
            </button>

            {/* PREVIOUS */}

            {gallery.length > 1 && (
              <button
                type="button"
                className="gallery-lightbox-arrow gallery-lightbox-left"
                onClick={previousLightboxImage}
                aria-label="Previous screenshot"
              >
                <FaChevronLeft />
              </button>
            )}

            {/* FULLSCREEN CONTENT */}

            <motion.div
              className="gallery-lightbox-content"
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
              }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {/* FULL IMAGE */}

              <div className="gallery-lightbox-image-container">
                <img
                  src={currentLightboxItem.image}
                  alt=""
                  className="gallery-lightbox-image"
                />
              </div>

              {/* DESCRIPTION */}

              {currentLightboxItem.description && (
                <div className="gallery-lightbox-description">
                  <p>{currentLightboxItem.description}</p>
                </div>
              )}

              {!currentLightboxItem.description && (
                <div className="gallery-lightbox-description">
                  <p>Project screenshot</p>
                </div>
              )}

              {/* COUNTER */}

              {gallery.length > 1 && (
                <span className="gallery-lightbox-counter">
                  {lightboxImage + 1} / {gallery.length}
                </span>
              )}
            </motion.div>

            {/* NEXT */}

            {gallery.length > 1 && (
              <button
                type="button"
                className="gallery-lightbox-arrow gallery-lightbox-right"
                onClick={nextLightboxImage}
                aria-label="Next screenshot"
              >
                <FaChevronRight />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectCard;

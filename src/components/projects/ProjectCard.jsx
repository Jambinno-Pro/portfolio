import { useState } from "react";

import {
    FaExternalLinkAlt,
    FaGithub,
    FaTimes,
    FaArrowRight,
} from "react-icons/fa";

import "../../styles/projects/ProjectCard.css";

function ProjectCard({ project }) {

    const [showDetails, setShowDetails] = useState(false);

    // ==========================================
    // PROJECT IMAGE
    // ==========================================

 const imageUrl = project.image
    ? `https://innocent-portfolio-api.onrender.com${project.image}`
    : "/images/no-image.png";

    // ==========================================
    // TECHNOLOGIES
    // Supports:
    // ["React", "Node.js", "MongoDB"]
    //
    // OR:
    // "React, Node.js, MongoDB"
    // ==========================================

    const technologies = Array.isArray(project.technologies)
        ? project.technologies
        : typeof project.technologies === "string"
            ? project.technologies
                .split(",")
                .map((tech) => tech.trim())
                .filter(Boolean)
            : [];


    return (

        <>

            {/* ==========================================
                PROJECT CARD
            ========================================== */}

            <div className="project-card">


                {/* ==========================================
                    FEATURED BADGE
                ========================================== */}

                {project.featured && (

                    <span className="featured-badge">

                        ★ Featured

                    </span>

                )}


                {/* ==========================================
                    BROWSER PREVIEW
                ========================================== */}

                <div className="browser-window">

                    <div className="browser-header">


                        {/* Browser dots */}

                        <div className="browser-dots">

                            <span className="dot red"></span>

                            <span className="dot yellow"></span>

                            <span className="dot green"></span>

                        </div>


                        {/* Browser address */}

                        <div className="browser-address">

                            {project.liveDemo || "Project Preview"}

                        </div>

                    </div>


                    {/* Project image */}

                    <img
                        src={imageUrl}
                        alt={project.title}
                        className="project-image"
                    />

                </div>


                {/* ==========================================
                    PROJECT CONTENT
                ========================================== */}

                <div className="project-content">


                    {/* Project title */}

                    <h3>

                        {project.title}

                    </h3>


                    {/* Project description */}

                    <p className="project-summary">

                        {project.description}

                    </p>


                    {/* ==========================================
                        TECHNOLOGIES
                    ========================================== */}

                    <div className="tech-stack">

                        {technologies.length > 0 ? (

                            technologies.map((tech, index) => (

                                <span key={index}>

                                    {tech}

                                </span>

                            ))

                        ) : (

                            <span>

                                No technologies listed

                            </span>

                        )}

                    </div>


                    {/* ==========================================
                        PROJECT ACTIONS
                    ========================================== */}

                    <div className="project-buttons">


                        {/* Project details */}

                        <button
                            type="button"
                            className="details-btn"
                            onClick={() => setShowDetails(true)}
                        >

                            View Project Details

                            <FaArrowRight />

                        </button>


                        {/* Live website */}

                        {project.liveDemo && (

                            <a
                                href={project.liveDemo}
                                target="_blank"
                                rel="noreferrer"
                                className="visit-btn"
                            >

                                Visit Website

                                <FaExternalLinkAlt />

                            </a>

                        )}

                    </div>

                </div>

            </div>


            {/* ==========================================
                PROJECT DETAILS MODAL
            ========================================== */}

            {showDetails && (

                <div
                    className="project-modal-overlay"
                    onClick={() => setShowDetails(false)}
                >


                    <div
                        className="project-modal"
                        onClick={(e) => e.stopPropagation()}
                    >


                        {/* ==========================================
                            MODAL HEADER
                        ========================================== */}

                        <div className="project-modal-header">


                            <div>

                                <span className="project-modal-label">

                                    PROJECT CASE STUDY

                                </span>


                                <h2>

                                    {project.title}

                                </h2>

                            </div>


                            {/* Close button */}

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() => setShowDetails(false)}
                                aria-label="Close project details"
                            >

                                <FaTimes />

                            </button>

                        </div>


                        {/* ==========================================
                            PROJECT IMAGE
                        ========================================== */}

                        <div className="project-modal-image">

                            <img
                                src={imageUrl}
                                alt={project.title}
                            />

                        </div>


                        {/* ==========================================
                            PROJECT DETAILS BODY
                        ========================================== */}

                        <div className="project-modal-body">


                            {/* ==========================================
                                OVERVIEW
                            ========================================== */}

                            <section className="project-detail-section">

                                <h3>

                                    Project Overview

                                </h3>


                                <p>

                                    {project.description}

                                </p>

                            </section>


                            {/* ==========================================
                                TECHNOLOGIES
                            ========================================== */}

                            <section className="project-detail-section">

                                <h3>

                                    Technologies Used

                                </h3>


                                <div className="modal-tech-stack">

                                    {technologies.length > 0 ? (

                                        technologies.map((tech, index) => (

                                            <span key={index}>

                                                {tech}

                                            </span>

                                        ))

                                    ) : (

                                        <p className="no-technologies">

                                            No technologies listed for this project.

                                        </p>

                                    )}

                                </div>

                            </section>


                            {/* ==========================================
                                DEVELOPMENT
                            ========================================== */}

                            <section className="project-detail-section">

                                <h3>

                                    Development

                                </h3>


                                <p>

                                    This project was planned, designed
                                    and developed with a focus on
                                    performance, usability, responsive
                                    design and maintainable code.

                                    I structured the project into
                                    reusable components and connected
                                    the required functionality to create
                                    a complete digital solution.

                                </p>

                            </section>


                            {/* ==========================================
                                KEY FEATURES
                            ========================================== */}

                            <section className="project-detail-section">

                                <h3>

                                    Key Features

                                </h3>


                                <ul className="project-features">

                                    <li>

                                        Responsive desktop, tablet and
                                        mobile design

                                    </li>


                                    <li>

                                        Modern and user-friendly interface

                                    </li>


                                    <li>

                                        Structured and reusable components

                                    </li>


                                    <li>

                                        Dynamic project information

                                    </li>


                                    <li>

                                        Database-driven content where applicable

                                    </li>


                                    <li>

                                        API integration where required

                                    </li>

                                </ul>

                            </section>


                            {/* ==========================================
                                PROJECT BUTTONS
                            ========================================== */}

                            <div className="project-modal-actions">


                                {/* Live website */}

                                {project.liveDemo && (

                                    <a
                                        href={project.liveDemo}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="visit-btn"
                                    >

                                        Visit Website

                                        <FaExternalLinkAlt />

                                    </a>

                                )}


                                {/* GitHub */}

                                {project.github && (

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

                </div>

            )}

        </>

    );

}

export default ProjectCard;
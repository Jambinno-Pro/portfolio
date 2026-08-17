function AboutCard({ about }) {

  if (!about) return null;

  return (

    <div className="about-card">

      <div className="about-left">

        <img
          src={`http://localhost:5000${about.image}`}
          alt={about.fullName}
          className="about-avatar"
        />

      </div>

      <div className="about-right">

        <h2>{about.fullName}</h2>

        <h4>{about.jobTitle}</h4>

        <p>{about.bio}</p>

        <div className="about-grid">

          <div>
            <strong>Experience</strong>
            <span>{about.experience} Years</span>
          </div>

          <div>
            <strong>Location</strong>
            <span>{about.location}</span>
          </div>

          <div>
            <strong>Email</strong>
            <span>{about.email}</span>
          </div>

          <div>
            <strong>Phone</strong>
            <span>{about.phone}</span>
          </div>

        </div>

        <div className="social-links">

          {about.github && (
            <a
              href={about.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}

          {about.linkedin && (
            <a
              href={about.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}

          {about.facebook && (
            <a
              href={about.facebook}
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
          )}

          {about.instagram && (
            <a
              href={about.instagram}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          )}

          {about.twitter && (
            <a
              href={about.twitter}
              target="_blank"
              rel="noreferrer"
            >
              X
            </a>
          )}

        </div>

        {

          about.resume &&

          <a

            href={`http://localhost:5000${about.resume}`}

            target="_blank"

            rel="noreferrer"

            className="resume-btn"

          >

            Download Resume

          </a>

        }

      </div>

    </div>

  );

}

export default AboutCard;
Innocent Jambaya — Full-Stack Developer Portfolio

A modern, responsive full-stack developer portfolio built from scratch to showcase my experience, technical skills, services, projects, and professional background.

The project was developed as a real-world full-stack application rather than a simple static portfolio. The public website is connected to a backend REST API and database, allowing portfolio content to be managed dynamically through a dedicated admin dashboard.

Frontend
React.js
JavaScript
HTML5
CSS3
React Router
Axios
React Icons

Backend
Node.js
Express.js
REST API
Database
MongoDB
Mongoose

Development Tools
Git
GitHub
VS Code
Postman
npm


## Portfolio V1

V1 focuses on a polished public portfolio, a practical admin CMS, responsive layouts, basic SEO/accessibility, and safer environment-variable handling.

### Environment variables

The backend requires a local `backend/.env` created from `backend/.env.example`. Never commit real database credentials, JWT secrets, or server-side Supabase keys.

For the frontend, `VITE_API_URL` may be used to override the default API URL at build time.

## Portfolio V1 media strategy

- Project text, links, technologies, featured state and status remain dynamic from the API/database.
- Project artwork is intentionally local and hard-coded through `src/data/projectImages.js`. This prevents broken project images when external storage is unavailable.
- Add/edit projects no longer depends on uploading a project image.
- Resume information remains dynamic in MongoDB.
- Resume information is stored in MongoDB and is the single source for the public resume.
- `/api/resume/download` generates a fresh, styled PDF directly from the current MongoDB resume data. No Supabase resume bucket, uploaded CV file, or external resume storage is required.
- The generated PDF preserves paragraph and line-break formatting from the resume fields.
- Resume create/update/delete endpoints require the authenticated admin token.

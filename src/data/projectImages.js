// Local project artwork is intentionally hard-coded so project cards never
// depend on external storage. Project text, links, status and technologies
// remain dynamic and continue to come from the API/database.
import luxury from "../assets/projects/3bluxury.png";
import afrika from "../assets/projects/afrikaep.png";
import aes from "../assets/projects/aes.png";
import greens from "../assets/projects/greens.png";
import tabby from "../assets/projects/tabby.png";

const projectImages = {
  "3b luxury coaches": luxury,
  "afrika energy projects": afrika,
  "aes zimbabwe": aes,
  "greens shuttle": greens,
  "tabby hair academy": tabby,
};

const categoryImages = {
  "Web Development": luxury,
  "Graphic Design": tabby,
  "App Development": aes,
  "Database Development": greens,
};

export function getProjectImage(project) {
  const title = String(project?.title || project?.name || "")
    .trim()
    .toLowerCase();

  return projectImages[title] || categoryImages[project?.category] || luxury;
}

export default projectImages;

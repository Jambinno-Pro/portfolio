import "../../styles/projects/ProjectFilter.css";

function ProjectFilter({ filter, setFilter }) {

  const categories = [
    "All",
    "Web Development",
    "Graphic Design",
    "App Development",
    "Database Development",
  ];

  return (

    <div className="project-filter">

      {categories.map((category) => (

        <button
          key={category}
          className={filter === category ? "active" : ""}
          onClick={() => setFilter(category)}
        >
          {category}
        </button>

      ))}

    </div>

  );

}

export default ProjectFilter;
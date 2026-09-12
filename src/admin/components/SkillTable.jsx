import {
  FaEdit,
  FaTrash,
  FaStar,
} from "react-icons/fa";

import "../styles/SkillTable.css";

function SkillTable({

  skills,

  editSkill,

  deleteSkill,

}) {

  return (

    <div className="table-container">

      <table className="skills-table">

        <thead>

          <tr>

            <th>Skill</th>

            <th>Category</th>

            <th>Level</th>

            <th>Featured</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {skills.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >

                No skills found.

              </td>

            </tr>

          ) : (

            skills.map((skill) => (

              <tr key={skill._id}>

                <td>

                  <div className="skill-info">

                    <h4>{skill.name}</h4>

                    <small>{skill.icon}</small>

                  </div>

                </td>

                <td>

                  <span className="category-badge">

                    {skill.category}

                  </span>

                </td>

                <td>

                  <div className="level-wrapper">

                    <div className="level-bar">

                      <div

                        className="level-fill"

                        style={{
                          width: `${skill.level}%`,
                        }}

                      ></div>

                    </div>

                    <span>

                      {skill.level}%

                    </span>

                  </div>

                </td>

                <td>

                  {skill.featured ? (

                    <FaStar
                      color="#FFD700"
                      size={18}
                    />

                  ) : (

                    "-"

                  )}

                </td>

                <td>

                  <span

                    className={`status ${skill.status.toLowerCase()}`}

                  >

                    {skill.status}

                  </span>

                </td>

                <td>

                  <button

                    className="edit-btn"

                    onClick={() => editSkill(skill)}

                  >

                    <FaEdit />

                  </button>

                  <button

                    className="delete-btn"

                    onClick={() =>
                      deleteSkill(skill._id)
                    }

                  >

                    <FaTrash />

                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default SkillTable;
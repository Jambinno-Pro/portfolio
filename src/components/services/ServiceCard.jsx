import "../../styles/services/ServiceCard.css";

import {
  FaLaptopCode,
  FaPalette,
  FaDatabase,
  FaWordpress,
  FaPaintBrush,
  FaMobileAlt,
  FaReact,
} from "react-icons/fa";

function ServiceCard({ service }) {

  let Icon = FaReact;

  const title = service.title.toLowerCase();

  if (title.includes("full stack")) {
    Icon = FaLaptopCode;
  } else if (title.includes("frontend") || title.includes("ui")) {
    Icon = FaPalette;
  } else if (title.includes("database")) {
    Icon = FaDatabase;
  } else if (title.includes("wordpress")) {
    Icon = FaWordpress;
  } else if (title.includes("graphic")) {
    Icon = FaPaintBrush;
  } else if (title.includes("app")) {
    Icon = FaMobileAlt;
  }

  return (
    <div className="service-card">

      <div className="service-icon">
        <Icon />
      </div>

      <h3 className="service-title">
        {service.title}
      </h3>

      <p className="service-description">
        {service.description}
      </p>

      <div className="service-footer">
        <span className="service-status">
          {service.status}
        </span>
      </div>

    </div>
  );
}

export default ServiceCard;
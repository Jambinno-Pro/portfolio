import "../styles/Topbar.css";

import { FaBell, FaUserCircle } from "react-icons/fa";

function Topbar(){

return(

<header className="topbar">

<h2>

Dashboard

</h2>

<div className="topbar-right">

<FaBell className="top-icon"/>

<div className="admin-user">

<FaUserCircle/>

<span>Innocent Jambaya</span>

</div>

</div>

</header>

)

}

export default Topbar;
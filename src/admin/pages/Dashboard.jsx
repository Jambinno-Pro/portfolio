import AdminLayout from "../components/AdminLayout";

import "../styles/Dashboard.css";

import {

FaProjectDiagram,
FaEnvelope,
FaCode,
FaEye

} from "react-icons/fa";

function Dashboard(){

const stats=[

{

title:"Projects",

number:18,

icon:<FaProjectDiagram/>

},

{

title:"Messages",

number:52,

icon:<FaEnvelope/>

},

{

title:"Skills",

number:26,

icon:<FaCode/>

},

{

title:"Visitors",

number:"5,431",

icon:<FaEye/>

}

];

return(

<AdminLayout>

<div className="dashboard">

<h1>

Welcome Back 👋

</h1>

<div className="stats-grid">

{

stats.map((card,index)=>(

<div

className="stat-card"

key={index}

>

<div className="stat-icon">

{card.icon}

</div>

<h2>

{card.number}

</h2>

<p>

{card.title}

</p>

</div>

))

}

</div>

</div>

</AdminLayout>

)

}

export default Dashboard;
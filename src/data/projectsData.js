// Website Screenshots
import luxury from "../assets/projects/3bluxury.png";
import afrika from "../assets/projects/afrikaep.png";
import aes from "../assets/projects/aes.png";
import greens from "../assets/projects/greens.png";
import tabby from "../assets/projects/tabby.png";
// import portfolio from "../assets/projects/portfolio.jpg";

// // Graphic Design Images
// import churchFlyer from "../assets/projects/church-flyer.jpg";
// import womenConference from "../assets/projects/women-conference.jpg";
// import youthCamp from "../assets/projects/youth-camp.jpg";
// import logos from "../assets/projects/logo-design.jpg";
// import businessCards from "../assets/projects/business-cards.jpg";
// import socialMedia from "../assets/projects/social-media.jpg";
// import rollupBanner from "../assets/projects/rollup-banner.jpg";

// // App Images
// import weather from "../assets/projects/weather-app.jpg";
// import calculator from "../assets/projects/calculator-app.jpg";

// // Database Images
// import database from "../assets/projects/database.jpg";
// import inventory from "../assets/projects/inventory.jpg";
// import student from "../assets/projects/student.jpg";
// import busdb from "../assets/projects/bus-database.jpg";

const projects = [

/* ================= WEB DEVELOPMENT ================= */

{
    id:1,
    featured:true,
    category:"Web Development",
    title:"3B Luxury Coaches",
    image:luxury,
    website:"https://3bluxurycoaches.co.za",
    github:"",
    description:"Luxury online bus ticket booking platform with seat reservation and WooCommerce integration.",
    technologies:[
        "WordPress",
        "WooCommerce",
        "PHP",
        "JavaScript",
        "CSS"
    ]
},

{
    id:2,
    featured:true,
    category:"Web Development",
    title:"Afrika Energy Projects",
    image:afrika,
    website:"https://afrikaep.com",
    github:"",
    description:"Corporate solar energy website showcasing renewable energy services and products.",
    technologies:[
        "WordPress",
        "Elementor",
        "CSS",
        "SEO"
    ]
},

{
    id:3,
    featured:false,
    category:"Web Development",
    title:"AES Zimbabwe",
    image:aes,
    website:"https://aes.co.zw",
    github:"",
    description:"Professional corporate website developed for engineering and industrial services.",
    technologies:[
        "WordPress",
        "CSS",
        "PHP"
    ]
},

{
    id:4,
    featured:true,
    category:"Web Development",
    title:"Greens Shuttle",
    image:greens,
    website:"https://greensshuttle.co.za",
    github:"",
    description:"Modern airport shuttle booking website with responsive design.",
    technologies:[
        "WordPress",
        "CSS",
        "PHP"
    ]
},

{
    id:5,
    featured:false,
    category:"Web Development",
    title:"Tabby Hair Academy",
    image:tabby,
    website:"https://tabbyhairacademy.co.za/",
    github:"",
    description:"Hair academy and beauty training website with a modern user interface.",
    technologies:[
        "WordPress",
        "Elementor",
        "CSS"
    ]
},


// {
//     id:7,
//     featured:false,
//     category:"Web Development",
//     title:"Personal Portfolio",
//     image:portfolio,
//     website:"#",
//     github:"https://github.com/",
//     description:"Modern React portfolio showcasing development and graphic design work.",
//     technologies:[
//         "React",
//         "CSS",
//         "JavaScript"
//     ]
// },

// /* ================= GRAPHIC DESIGN ================= */

// {
//     id:8,
//     featured:true,
//     category:"Graphic Design",
//     title:"Church Flyer Collection",
//     image:churchFlyer,
//     website:"#",
//     github:"",
//     description:"Creative church event flyers designed using Adobe Creative Suite.",
//     technologies:[
//         "Photoshop",
//         "Illustrator",
//         "CorelDRAW"
//     ]
// },

// {
//     id:9,
//     featured:true,
//     category:"Graphic Design",
//     title:"Women Transform Conference",
//     image:womenConference,
//     website:"#",
//     github:"",
//     description:"Conference branding including flyers, banners and promotional artwork.",
//     technologies:[
//         "Photoshop",
//         "Illustrator"
//     ]
// },

// {
//     id:10,
//     featured:false,
//     category:"Graphic Design",
//     title:"Youth Camp Posters",
//     image:youthCamp,
//     website:"#",
//     github:"",
//     description:"Modern youth camp posters designed for digital and print campaigns.",
//     technologies:[
//         "Photoshop",
//         "CorelDRAW"
//     ]
// },

// {
//     id:11,
//     featured:false,
//     category:"Graphic Design",
//     title:"Logo Design Collection",
//     image:logos,
//     website:"#",
//     github:"",
//     description:"Professional logo collection designed for startups and businesses.",
//     technologies:[
//         "Illustrator",
//         "CorelDRAW"
//     ]
// },

// {
//     id:12,
//     featured:false,
//     category:"Graphic Design",
//     title:"Business Card Designs",
//     image:businessCards,
//     website:"#",
//     github:"",
//     description:"Elegant business cards designed for corporate branding.",
//     technologies:[
//         "Illustrator",
//         "Photoshop"
//     ]
// },

// {
//     id:13,
//     featured:false,
//     category:"Graphic Design",
//     title:"Social Media Graphics",
//     image:socialMedia,
//     website:"#",
//     github:"",
//     description:"Social media campaigns and promotional designs for multiple businesses.",
//     technologies:[
//         "Photoshop",
//         "Canva"
//     ]
// },

// {
//     id:14,
//     featured:false,
//     category:"Graphic Design",
//     title:"Roll-up Banner Designs",
//     image:rollupBanner,
//     website:"#",
//     github:"",
//     description:"Large format exhibition banners for conferences and marketing events.",
//     technologies:[
//         "CorelDRAW",
//         "Illustrator"
//     ]
// },

// /* ================= APP DEVELOPMENT ================= */

// {
//     id:15,
//     featured:true,
//     category:"App Development",
//     title:"Weather App",
//     image:weather,
//     website:"#",
//     github:"https://github.com/",
//     description:"React weather application using real-time weather API.",
//     technologies:[
//         "React",
//         "API",
//         "CSS"
//     ]
// },

// {
//     id:16,
//     featured:false,
//     category:"App Development",
//     title:"Calculator App",
//     image:calculator,
//     website:"#",
//     github:"https://github.com/",
//     description:"Responsive calculator application built with React.",
//     technologies:[
//         "React",
//         "JavaScript",
//         "CSS"
//     ]
// },

// /* ================= DATABASE DEVELOPMENT ================= */

// {
//     id:17,
//     featured:true,
//     category:"Database Development",
//     title:"Database Management System",
//     image:database,
//     website:"#",
//     github:"https://github.com/",
//     description:"Complete CRUD database management application.",
//     technologies:[
//         "MySQL",
//         "PHP",
//         "SQL"
//     ]
// },

// {
//     id:18,
//     featured:false,
//     category:"Database Development",
//     title:"Inventory Management System",
//     image:inventory,
//     website:"#",
//     github:"https://github.com/",
//     description:"Inventory tracking and stock management system.",
//     technologies:[
//         "MySQL",
//         "PHP",
//         "SQL"
//     ]
// },

// {
//     id:19,
//     featured:false,
//     category:"Database Development",
//     title:"Student Management System",
//     image:student,
//     website:"#",
//     github:"https://github.com/",
//     description:"Student records and academic management database.",
//     technologies:[
//         "MySQL",
//         "PHP",
//         "SQL"
//     ]
// },

// {
//     id:20,
//     featured:false,
//     category:"Database Development",
//     title:"Bus Reservation Database",
//     image:busdb,
//     website:"#",
//     github:"https://github.com/",
//     description:"Database system for passenger bookings, routes and ticket management.",
//     technologies:[
//         "MySQL",
//         "PHP",
//         "SQL"
//     ]
// }

];

export default projects;
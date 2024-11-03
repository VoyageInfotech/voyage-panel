import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Contact from "layouts/contact";
import GetTouch from "layouts/gettouch";
import Resume from "layouts/resume";
import User from "layouts/User";
import Icon from "@mui/material/Icon";
import Login from "layouts/auth/Login";
import Register from "layouts/auth/Register";
import Logout from "layouts/auth/Logout";

const userRole = localStorage.getItem("role");

const routes = [
  {
    type: "collapse",
    name: "Login",
    key: "login",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/login",
    component: <Login />,
    isPublic: true,
  },
  ...(userRole === "0"
    ? [
        // Check userRole and include User route if role is "0"
        {
          type: "collapse",
          name: "User",
          key: "user",
          icon: <Icon fontSize="small">User</Icon>,
          route: "/user",
          component: <User />,
          isPublic: false,
        },
      ]
    : []), // If userRole is not "0", an empty array is used to omit the User route
  {
    type: "collapse",
    name: "Register",
    key: "register",
    icon: <Icon fontSize="small">Register</Icon>,
    route: "/register",
    component: <Register />,
    isPublic: true,
  },
  {
    type: "collapse",
    name: "Resume",
    key: "resume",
    icon: <Icon fontSize="small">description</Icon>,
    route: "/resume",
    component: <Resume />,
    isPublic: false,
  },
  {
    type: "collapse",
    name: "Contact",
    key: "contact",
    icon: <Icon fontSize="small">contacts</Icon>,
    route: "/contact",
    component: <Contact />,
    isPublic: false,
  },
  {
    type: "collapse",
    name: "Get Touch",
    key: "get-touch",
    icon: <Icon fontSize="small">phone</Icon>,
    route: "/get-touch",
    component: <GetTouch />,
    isPublic: false,
  },
  {
    type: "collapse",
    name: "Testimonial",
    key: "testimonial",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/testimonial",
    component: <Billing />,
    isPublic: false,
  },
  {
    type: "collapse",
    name: "Technology",
    key: "technology",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/technology",
    component: <Notifications />,
    isPublic: false,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    component: <Logout />,
    isPublic: false,
  },
];

export default routes;

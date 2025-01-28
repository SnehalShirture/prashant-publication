import Dashboard from "../pages/user/UserDashboard";
import Shelf from "../pages/user/UserShelf";
import UserBooks from "../pages/user/Userbooks";
import LibraryAdminDashboard from "../pages/collegeAdmin/CadminDashboard";
import LibrarySubscription from "../pages/collegeAdmin/CollegeSubscription";
import UserSubscription from "../pages/user/UserSubscription";
import CAdminProfile from "../pages/collegeAdmin/CAdminProfile";
import UserProfile from "../pages/user/UserProfile";
import Collegebooks from "../pages/collegeAdmin/Collegebooks";
import SuperAdminAppBar from "../pages/sAdmin/SAdminAppbar";
import AllStudents from "../pages/collegeAdmin/AllStudents";
import SAdminProfile from "../pages/sAdmin/SAdminProfile";

export const User_Routes = [
  { path: "/user/dashboard", element: <Dashboard />, label: "Dashboard" },
  { path: "/user/shelf", element: <Shelf />, label: "Shelf" },
  { path: "/user/books", element: <UserBooks />, label: "Books" },
  { path: "/user/subscription", element: <UserSubscription />, label: "Subscription" },
  { path: "/user/profile", element: <UserProfile />, label: "UserProfile" },
];

export const Librarian_Routes = [
  { path: "/librarydashboard", element: <LibraryAdminDashboard />, label: "Library Dashboard" },
  { path: "/library/students", element: <AllStudents />, label: "All Users" },
  { path: "/library/books", element: <Collegebooks />, label: "Books" },
  { path: "/library/subscription", element: <LibrarySubscription />, label: "Subscription" },
  { path: "/library/profile", element: <CAdminProfile />, label: "CAdminProfile" },
];

export const SAdmin_Routes = [
  { path: "/sadmin/appbar", element: <SuperAdminAppBar />, label: "superAdmin Dashboard" },
  { path: "/sadmin/profile", element: <SAdminProfile />, label: "superAdmin Profile" },
]
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {

   const { UserData, islogin } = useSelector((state) => state.user);
   const role = UserData.user_id.role
      
   const initialPath =
    role === "user" ? "/user/dashboard" :
      role === "CollegeAdmin" ? "/librarydashboard" :
        role === "SuperAdmin" ? "/sadmin/dashboard" : "/";

        return allowedRoles.includes(role) ?
        <Outlet /> :
        <Navigate to={initialPath} replace />

      };

export default ProtectedRoute 
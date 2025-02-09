import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
    const { UserData, login } = useSelector((state) => state.user);
    console.log("role :" , role)
    console.log( "childen : ",{children})
    if (!login) {
        return <Navigate to="/" />;
    }
    // Check if the user has the required role
    // if (Userrole !== role) {
    //     return <Navigate to="/" />;
    //     }
    //     // If the user's role does not match the required role, redirect based on their role
        if (role === "user") {
            {children}
            return <Navigate to="/user/dashboard" />;
        } else if (role === "CollegeAdmin") {
            {children}
            return <Navigate to="/librarydashboard" />;
        } else {
            {children}
            return <Navigate to="/sadmin/dashboard" />;
        }
        // else {
        //     // If the role is unknown, redirect to a default page (e.g., home)
        //     return <Navigate to="/" />;
        // }
    //  return children;
};

export default ProtectedRoute;
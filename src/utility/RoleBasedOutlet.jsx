import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const RoleBasedOutlet = () => {
    const { UserData } = useSelector((state) => state.user);
    const role = UserData.user_id.role

    console.log(" role :" , role)
  return <Outlet context={{ role }} />; // Provide role context to child routes
};

export default RoleBasedOutlet;

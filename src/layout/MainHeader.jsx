import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Appbar from "../pages/user/UserAppbar"; // User AppBar
import CollegeAppbar from "../pages/collegeAdmin/CollegeAppbar"; // College Admin AppBar
import CommonAppBar from "../components/common/CommonAppbar"; // Common AppBar
import SuperAdminAppBar from "../pages/sAdmin/SAdminAppbar";

const Header = () => {
  
  const { UserData } = useSelector((state) => state.user); 
  console.log(UserData)
  const userRole = UserData.user_id?.role; 


  switch(userRole) {
    case "user":
      return <Appbar />;
    case "CollegeAdmin":
      return <CollegeAppbar />;
    case "SuperAdmin":
      return <SuperAdminAppBar/>;
    default:
      return <CommonAppBar />;
  }
};

export default Header;

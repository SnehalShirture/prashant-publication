import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../reduxwork/UserSlice";
import Appbar from "../pages/user/UserAppbar"; // User AppBar
import CollegeAppbar from "../pages/collegeAdmin/CollegeAppbar"; // College Admin AppBar
import CommonAppBar from "../components/common/CommonAppbar"; // Common AppBar
import { Typography } from "@mui/material";
import SAdminDashboard from "../pages/sAdmin/SAdminDashboard";
import SuperAdminAppBar from "../pages/sAdmin/SAdminAppbar";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { UserData } = useSelector((state) => state.user); 
  console.log(UserData)
  const userRole = UserData.user_id?.role; // Use optional chaining and provide a fallback
  const userIsBlocked = UserData?.isBlock || false; // Use optional chaining and provide a fallback

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); 
  };

  // if (!UserData) {
  //   return <CommonAppBar />; // Render a common app bar if UserData is undefined
  // }

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

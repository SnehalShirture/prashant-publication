import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { User_Routes, Librarian_Routes, SAdmin_Routes } from "./utility/RouteList";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/Signup";
import ErrorPage from "./components/common/ErrorPage";
import Header from "./layout/MainHeader";
import ResetPassword from "./components/common/ResetPassword";
import "./index.css";
import { useIsFetching } from "@tanstack/react-query";
import Loading from "./components/common/Loading";
import { useAlert } from "./custom/CustomAlert";
import Footer from "./components/common/Footer";

export const DisableScreenshot = () => {
  const { showAlert } = useAlert();

  useEffect(() => {
    const blockPrintScreen = (event) => {
      if (event.key === "PrintScreen" || (event.ctrlKey && event.key === "p")) {
        event.preventDefault();
        showAlert("Screenshots are disabled on this site.", "error");
      }
    };

    const disableRightClick = (event) => {
      event.preventDefault();
      showAlert("Right-click is disabled.", "error");
    };

    const disableDragAndDrop = (event) => {
      event.preventDefault();
    };

    const disableSaveShortcuts = (event) => {
      if ((event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === "s")) {
        event.preventDefault();
        showAlert("Saving is disabled on this site.", "error");
      }
    };

    document.addEventListener("keydown", blockPrintScreen);
    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("dragstart", disableDragAndDrop);
    document.addEventListener("keydown", disableSaveShortcuts);

    return () => {
      document.removeEventListener("keydown", blockPrintScreen);
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("dragstart", disableDragAndDrop);
      document.removeEventListener("keydown", disableSaveShortcuts);
    };
  }, []);

  return null;
};

const App = () => {
  const navigate = useNavigate();
  const { UserData } = useSelector((state) => state.user);
  const role = UserData?.user_id?.role;
  const isFetching = useIsFetching();

  return (
    <>
      <Header />
      {isFetching > 0 && <Loading />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="*" element={<ErrorPage />} />

        {/* Role-based Routes */}
        {role === "user" &&
          User_Routes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}

        {role === "CollegeAdmin" &&
          Librarian_Routes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}

        {role === "SuperAdmin" &&
          SAdmin_Routes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
      </Routes>
      <Footer/>
    </>
  );
};

export default App;

// import React from "react";
// import AboutUs from "./components/common/AboutUs";
// import Home from "./components/common/Home";
// import OurTeam from "./components/common/OurTeam";

// const App = () =>{
//   return(
//     <div>
//       <Home/>
//       <AboutUs/>
//       <OurTeam/>
//     </div>
//   )
// }
// export default App
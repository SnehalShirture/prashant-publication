import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate, BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
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
import Home from "./components/common/Home";
import AboutUs from "./components/common/AboutUs";
import OurTeam from "./components/common/OurTeam";
import ContactUs from "./components/common/ContactUs";
import CommonAppBar from "./components/common/CommonAppbar";


export const LandingPage = () => {
  const sectionsRef = useRef({
    home: React.createRef(),
    about: React.createRef(),
    ourteam: React.createRef(),
    contact: React.createRef(),
  });

  const handleScroll = (section) => {
    if (sectionsRef.current[section]?.current) {
      sectionsRef.current[section].current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Include the CommonAppBar */}
      {/* <CommonAppBar handleScroll={handleScroll} /> */}

      {/* Sections */}
      <div ref={sectionsRef.current.home}><Home /></div>
      <div ref={sectionsRef.current.about}><AboutUs /></div>
      <div ref={sectionsRef.current.ourteam}><OurTeam /></div>
      <div ref={sectionsRef.current.contact}><ContactUs /></div>
    </>
  );
};




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
  const { UserData, islogin } = useSelector((state) => state.user);
  const role = UserData?.user_id?.role;
  console.log("islogin  : ", islogin)
  const isFetching = useIsFetching();

  return (
    <>
      <Header />
      {isFetching > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Loading />
        </div>
      )}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            islogin ? (
              role === "user" ? (
                <Navigate to="/user/dashboard" />
              ) : role === "CollegeAdmin" ? (
                <Navigate to="/librarydashboard" />
              ) : role === "SuperAdmin" ? (
                <Navigate to="/sadmin/dashboard" />
              ) : null
            ) : (
              <LandingPage />
            )
          }
        />
        <Route path="/login" element={<Login />} />
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
      <Footer />
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
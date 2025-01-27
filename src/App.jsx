import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from "react-router-dom";
import { User_Routes, Librarian_Routes , SAdmin_Routes } from "./utility/RouteList";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/Signup";
import ErrorPage from "./components/common/ErrorPage";
import Header from "./layout/MainHeader";
import ResetPassword from "./components/common/ResetPassword";
import { logout } from './reduxwork/UserSlice'; // Redux action for logging out
import { userlogout } from './apiCalls/UserApi'; // API method for logging out
import "./index.css";

export const DisableScreenshot = () => {
  useEffect(() => {
    // Block print screen key
    const blockPrintScreen = (event) => {
      if (event.key === "PrintScreen") {
        event.preventDefault();
        alert("Screenshots are disabled on this site.");
      }
    };

    // Disable right-click context menu
    const disableRightClick = (event) => {
      event.preventDefault();
      alert("Right-click is disabled.");
    };

    // Add event listeners
    document.addEventListener("keydown", blockPrintScreen);
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      // Clean up event listeners
      document.removeEventListener("keydown", blockPrintScreen);
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  return null;
};

const App = () => {
  // Define public routes
  const publicRoutes = [
    { path: "/signup", element: <SignUp />, label: "SignUp" },
    { path: "/", element: <Login />, label: "Login" },
    // { path: "*", element: <ErrorPage />, label: "ErrorPage" },
    { path: "/resetpassword", element: <ResetPassword />, label: 'resetPassword' }
  ];

  return (  
    <>
      <Header />
      {/* Define Routes */}
      <Routes>
        {[...User_Routes, ...Librarian_Routes, SAdmin_Routes, ...publicRoutes].map((route, index) => (
          <Route
            exact
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </>
  );
};

export default App;

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from "react-router-dom";
import { User_Routes, Librarian_Routes, SAdmin_Routes } from "./utility/RouteList";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/Signup";
import ErrorPage from "./components/common/ErrorPage";
import Header from "./layout/MainHeader";
import ResetPassword from "./components/common/ResetPassword";
import "./index.css";
import { useAlert } from './custom/CustomAlert';

export const DisableScreenshot = () => {
  const { showAlert } = useAlert();

  useEffect(() => {
    // Block Print Screen key
    const blockPrintScreen = (event) => {
      if (event.key === "PrintScreen" || (event.ctrlKey && event.key === "p")) {
        event.preventDefault();
        showAlert("Screenshots are disabled on this site.", "error");
      }
    };

    // Disable right-click context menu
    const disableRightClick = (event) => {
      event.preventDefault();
      showAlert("Right-click is disabled.", "error");
    };

    // Disable dragging and dropping images
    const disableDragAndDrop = (event) => {
      event.preventDefault();
    };

    // Disable keyboard shortcuts for saving (Ctrl+S, Ctrl+Shift+S, etc.)
    const disableSaveShortcuts = (event) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === "s" || event.key === "S" || event.key === "Shift+S")) {
        event.preventDefault();
        showAlert("Saving is disabled on this site.", "error");
      }
    };

    // Add event listeners
    document.addEventListener("keydown", blockPrintScreen);
    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("dragstart", disableDragAndDrop);
    document.addEventListener("keydown", disableSaveShortcuts);

    // Clean up event listeners
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
  const { UserData } = useSelector((state) => state.user);
  // Define public routes
  const publicRoutes = [
    { path: "/signup", element: <SignUp />, label: "SignUp" },
    { path: "/", element: <Login />, label: "Login" },
    { path: "*", element: <ErrorPage />, label: "ErrorPage" },
    { path: "/resetpassword", element: <ResetPassword />, label: 'resetPassword' }
  ];

  return (
    <>
      <Header />
      {/* Define Routes */}
      <Routes>
        {[...User_Routes, ...Librarian_Routes, ...SAdmin_Routes , ...publicRoutes].map((route, index) => (
          <Route
            exact
            key={index}
            path={route.path}
            element={route.element}
              />
        ))}
        {/* {
          publicRoutes.map((route, index) => {
            <Route
              exact
              key={index}
              path={route.path}
              element={route.element}
            />
          })
        } */}
      </Routes>
    </>
  );
};

export default App;

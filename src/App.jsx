import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { User_Routes, Librarian_Routes , SAdmin_Routes} from "./utility/RouteList";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/Signup";
import ErrorPage from "./components/common/ErrorPage";
import Header from "./layout/MainHeader";
import ResetPassword from "./components/common/ResetPassword";

const App = () => {

  // Define public routes
  const publicRoutes = [
    { path: "/signup", element: <SignUp />, label: "SignUp" },
    { path: "/", element: <Login />, label: "Login" },
    { path: "*", element: <ErrorPage />, label: "ErrorPage" },
    // { path: "/profile", element: <Profile />, label: "Profile" }, 
    { path: "/resetpassword", element: <ResetPassword/>, label: 'resetPassword' }
  ];

  return (
    <>
      <Header />
      {/* Define Routes */}
      <Routes>
        {[...User_Routes, ...Librarian_Routes, ...SAdmin_Routes , ...publicRoutes].map((route, index) =>
        (
          <Route
            exact
            key={index}
            path={route.path}
            element={route.element}
          />
        ))
        }
      </Routes>
    </>
  );
};

export default App;


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from "react-router-dom";
import { User_Routes, Librarian_Routes } from "./utility/RouteList";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/Signup";
import ErrorPage from "./components/common/ErrorPage";
import Header from "./layout/MainHeader";
import ResetPassword from "./components/common/ResetPassword";
import { logout } from './reduxwork/UserSlice'; // Redux action for logging out
import { userlogout } from './apiCalls/UserApi'; // API method for logging out

const App = () => {
  // const dispatch = useDispatch();

  // const { UserData } = useSelector((state) => state.user);
  // console.log(UserData)


  // useEffect(() => {
  //   const handleTabClose = async (UserData) => {
  //     try {
  //       const logoutData = { userId: UserData._id } 
  //       await userlogout(logoutData);
  //       // Dispatch the Redux logout action 
  //       dispatch(logout());

  //     } catch (error) {
  //       console.error("Error during logout:", error);
  //     }
  //   };
  //   // Add event listener for tab close
  //   window.addEventListener("beforeunload", handleTabClose );

  //   // Cleanup event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener("beforeunload" , handleTabClose);
  //   };
  // }, [])

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
        {[...User_Routes, ...Librarian_Routes, ...publicRoutes].map((route, index) => (
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


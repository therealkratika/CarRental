import Landing from "./pages/Landing";
import {Routes, Route, BrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/forgotPassword";
import Dashboard from "./pages/Dashboard";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
              <Landing />
          }
        />
        <Route
        path = "/signup"
        element={ <Signup/>}
        />
        <Route
        path = "/login"
        element = {<Login/>}
        />
        <Route
        path = "/forgot-password"
        element = {<ForgotPassword/>}
        />
        <Route
        path = "/dashboard"
        element = {<Dashboard/>}
        />
      </Routes>
     </BrowserRouter>
  );
}
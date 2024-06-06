import "./App.css";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import { Toaster } from "react-hot-toast";
import axios from "axios"

function App() {

  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: "green",
              color: "white",
            },
          },
          error: {
            style: {
              background: "red",
              color: "white",
            },
          },
          duration: 3000,
          style: {},

          // Aria
          ariaProps: {
            role: "status",
            "aria-live": "polite",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
      </Routes>
    </>
  );
}

export default App;

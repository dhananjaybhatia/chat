import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import { VerifyUser } from "./utils/VerifyUser";
import Login from "./Login/Login";
import Register from "./Login/Register";
import Home from "./Home/Home";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="bg-custom-bg bg-cover bg-center h-screen">
      <div className="p-2 w-full h-full flex items-center justify-center">
        <ToastContainer />
        <Routes>
          <Route element={<VerifyUser />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

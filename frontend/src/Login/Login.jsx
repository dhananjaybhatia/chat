import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setAuthUser } = useAuth();

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      // Save user data in local storage (optional)
      localStorage.setItem("User", JSON.stringify(response.data.user));
      setAuthUser(response.data.user);
      toast.success("Login successful!", {
        className: "text-green font-bold rounded-lg shadow-lg", // Success toast
      });
      navigate("/");
    } catch (error) {
      // Handle errors
      if (error.response && error.response.status === 401) {
        // Show warning for invalid email or password
        toast.warning(
          error.response.data.message || "Invalid email or password"
        );
      } else {
        // Show generic error for other issues
        toast.error(
          error.response?.data?.message || "Login failed. Please try again."
        );
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false); // Reset loading state
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-purple-500 bg-opacity-10">
      <div className="w-[50vh] p-8 rounded-lg shadow-lg bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col text-center">
            <img
              className="rounded-full mx-auto w-24 h-24 object-cover opacity-60"
              src="https://cdn.pixabay.com/photo/2022/05/30/04/50/mickey-mouse-7230486_1280.png"
              alt="Mickey Mouse"
            />
            <div className="p-4 rounded-full border-2 border-white hover:border-orange-400 gap-4 mt-8 transition-colors duration-300">
              <input
                className="bg-transparent w-full outline-none text-black"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="p-4 rounded-full border-2 border-white hover:border-orange-400 gap-4 mt-8 transition-colors duration-300">
              <input
                className="bg-transparent w-full outline-none text-black"
                placeholder="Password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="p-4 font-medium rounded-full border-2 border-white bg-transparent mt-8 hover:border-orange-400 hover:bg-orange-400 hover:text-gray-600 transition-colors duration-300">
              <button className="w-full" type="submit">
                {isLoading ? "Logging.." : " Login"}
              </button>
            </div>
            <div className="mt-4">
              <p className="text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

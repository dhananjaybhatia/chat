import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"; // Import axios
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const { setAuthUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if passwords match
    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      setIsLoading(false);
      return toast.error("Passwords do not match");
    }

    try {
      // Send registration request to the backend
      const response = await axios.post(`${baseUrl}/api/auth/register`, {
        fullName: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        email: formData.email,
        password: formData.password,
        profilePic: formData.profilePic,
      });

      localStorage.setItem("User", JSON.stringify(response.data.user));
      setAuthUser(response.data.user);
      // Handle successful registration
      toast.success("Registration successful!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      // Handle errors
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
      setFormData("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  bg-purple-500 bg-opacity-10 ">
      <div className="w-[50vh] p-8  rounded-lg shadow-lg bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col text-center">
            <img
              className="rounded-full mx-auto w-24 h-24 object-cover opacity-60"
              src="https://cdn.pixabay.com/photo/2022/05/30/04/50/mickey-mouse-7230486_1280.png"
              alt="Mickey Mouse"
            />
            <div className="flex justify-center gap-4 mt-8">
              {" "}
              {/* Add gap between the inputs */}
              <div className="flex-1 p-4 rounded-full border-2 border-white hover:border-orange-400 transition-colors duration-300">
                <input
                  className="bg-transparent w-full outline-none text-black"
                  placeholder="First Name"
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1 p-4 rounded-full border-2 border-white hover:border-orange-400 transition-colors duration-300">
                <input
                  className="bg-transparent w-full outline-none text-black"
                  placeholder="Last Name"
                  type="text"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="p-4 rounded-full border-2 border-white hover:border-orange-400 gap-4 mt-8 transition-colors duration-300">
              <input
                className="bg-transparent w-full outline-none text-black"
                placeholder="Email"
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="p-4 rounded-full border-2 border-white hover:border-orange-400 gap-4 mt-8 transition-colors duration-300">
              <input
                className="bg-transparent w-full outline-none text-black"
                placeholder="Password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="p-4 rounded-full border-2 border-white hover:border-orange-400 gap-4 mt-8 transition-colors duration-300">
              <input
                className="bg-transparent w-full outline-none text-black"
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="p-4 font-medium rounded-full border-2 border-white bg-transparent mt-8 hover:border-orange-400 hover:bg-orange-400 hover:text-gray-600 transition-colors duration-300">
              <button className="w-full" type="submit">
                {isLoading ? "Registering" : "Register"}
              </button>
            </div>
            <div className="mt-4">
              <p className="text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

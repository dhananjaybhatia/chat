import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const VerifyUser = () => {
    const { authUser } = useAuth();

    if (!authUser) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};
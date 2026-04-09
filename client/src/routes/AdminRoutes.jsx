import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const storedUser = localStorage.getItem("user");

    // Agar user exist hi nahi karta
    if (!storedUser || storedUser === "undefined") {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(storedUser);

        if (!user?.role || user.role !== "admin") {
            return <Navigate to="/" replace />;
        }

        return children;

    } catch {
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;
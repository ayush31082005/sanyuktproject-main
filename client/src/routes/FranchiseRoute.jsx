import { Navigate } from "react-router-dom";

const FranchiseRoute = ({ children }) => {
    const storedFranchise = localStorage.getItem("franchiseData");

    // If no franchise data exists, redirect to franchise login
    if (!storedFranchise || storedFranchise === "undefined") {
        return <Navigate to="/franchise/login" replace />;
    }

    try {
        const franchise = JSON.parse(storedFranchise);

        // Check if franchise data is valid (has an id)
        if (!franchise?.franchiseId && !franchise?.id && !franchise?._id) {
            return <Navigate to="/franchise/login" replace />;
        }

        return children;

    } catch {
        localStorage.removeItem("franchiseData");
        return <Navigate to="/franchise/login" replace />;
    }
};

export default FranchiseRoute;

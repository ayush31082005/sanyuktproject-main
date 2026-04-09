import api from "./client";
import { toApiError } from "./errors";

export const registerUser = async (payload) => {
    try {
        const { data } = await api.post("/register", payload);
        return data;
    } catch (error) {
        throw toApiError(error, "Registration failed. Please try again.");
    }
};

export const loginUser = async (payload) => {
    try {
        const { data } = await api.post("/login", payload);

        if (data?.token) {
            localStorage.setItem("token", data.token);
        }

        if (data?.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        return data;
    } catch (error) {
        throw toApiError(error, "Login failed. Please check your credentials.");
    }
};


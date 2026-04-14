const DEFAULT_API_URL = "https://sanyuktproject-main-3.onrender.com";
const LEGACY_API_URL_MAP = {
    "https://sanyuktproject-2o2m.onrender.com": DEFAULT_API_URL,
};

const rawApiUrl = String(import.meta.env.VITE_API_URL || "").trim();
const normalizedApiUrl = LEGACY_API_URL_MAP[rawApiUrl.replace(/\/+$/, "")] || rawApiUrl;
const trimmedApiUrl = (normalizedApiUrl || DEFAULT_API_URL).replace(/\/+$/, "");

export const API_BASE_URL = /\/api$/i.test(trimmedApiUrl)
    ? trimmedApiUrl
    : `${trimmedApiUrl}/api`;

export const API_URL = API_BASE_URL.replace(/\/api\/?$/i, "");

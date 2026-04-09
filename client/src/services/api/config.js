const rawApiUrl = String(import.meta.env.VITE_API_URL || "").trim();

if (!rawApiUrl) {
    throw new Error(
        "Missing VITE_API_URL. Set VITE_API_URL in your environment (for example, in Vercel project settings)."
    );
}

const trimmedApiUrl = rawApiUrl.replace(/\/+$/, "");

export const API_BASE_URL = /\/api$/i.test(trimmedApiUrl)
    ? trimmedApiUrl
    : `${trimmedApiUrl}/api`;

export const API_URL = API_BASE_URL.replace(/\/api\/?$/i, "");


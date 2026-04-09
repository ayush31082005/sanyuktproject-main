// const mongoose = require("mongoose");

// const RETRY_DELAY_MS = Number(process.env.MONGO_RETRY_DELAY_MS) || 10000;
// let isConnecting = false;
// let retryTimer = null;

// const scheduleRetry = () => {
//     if (retryTimer) return;
//     retryTimer = setTimeout(() => {
//         retryTimer = null;
//         connectDB();
//     }, RETRY_DELAY_MS);
// };

// const connectDB = async () => {
//     if (mongoose.connection.readyState === 1 || isConnecting) {
//         return;
//     }

//     try {
//         isConnecting = true;
//         const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI;

//         if (!dbUri) {
//             console.error("MongoDB connection string (MONGO_URI or MONGODB_URI) is missing in environment variables.");
//             isConnecting = false;
//             return;
//         }

//         const conn = await mongoose.connect(dbUri, {
//             serverSelectionTimeoutMS: 5000,
//         });

//         console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//         isConnecting = false;
//     } catch (err) {
//         console.error("MongoDB connection error:", err.message);
//         isConnecting = false;
//         console.log(`🔁 Retrying MongoDB connection in ${Math.round(RETRY_DELAY_MS / 1000)}s...`);
//         scheduleRetry();
//     }
// };

// mongoose.connection.on("disconnected", () => {
//     console.warn("MongoDB disconnected.");
//     scheduleRetry();
// });

// mongoose.connection.on("error", (err) => {
//     console.error("MongoDB runtime error:", err.message);
// });

// module.exports = connectDB;



const mongoose = require("mongoose");
const dns = require("node:dns");

const getDbUris = () => {
    const primary = process.env.MONGO_URI || process.env.MONGODB_URI;
    const fallback = process.env.MONGO_URI_FALLBACK || process.env.MONGODB_URI_FALLBACK;

    if (!primary) {
        throw new Error(
            "MongoDB connection string (MONGO_URI or MONGODB_URI) is missing in environment variables."
        );
    }

    return { primary, fallback };
};

const shouldTryFallback = (err, uri) => {
    const msg = String(err?.message || "");
    return (
        typeof uri === "string" &&
        uri.startsWith("mongodb+srv://") &&
        (msg.includes("querySrv") ||
            msg.includes("ENOTFOUND") ||
            msg.includes("EAI_AGAIN") ||
            msg.includes("ECONNREFUSED"))
    );
};

const applyDnsServersIfConfigured = () => {
    const raw = process.env.DNS_SERVERS;
    if (!raw) return false;

    const servers = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    if (servers.length === 0) return false;
    dns.setServers(servers);
    return true;
};

const applyDefaultDnsServersForSrv = () => {
    // Helps when the OS DNS resolver intermittently refuses SRV queries.
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
};

const connectOnce = async (dbUri) => {
    return mongoose.connect(dbUri, {
        family: 4,
        serverSelectionTimeoutMS: 10000,
    });
};

const connectDB = async () => {
    const { primary, fallback } = getDbUris();

    // If user explicitly configured DNS servers, apply them early.
    applyDnsServersIfConfigured();

    try {
        const conn = await connectOnce(primary);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return;
    } catch (err) {
        // Retry once for SRV/DNS related errors using known-good public resolvers.
        if (shouldTryFallback(err, primary) && !process.env.DNS_SERVERS) {
            try {
                applyDefaultDnsServersForSrv();
                const conn = await connectOnce(primary);
                console.log(`✅ MongoDB Connected (dns retry): ${conn.connection.host}`);
                return;
            } catch (_) {
                // fall through to fallback / final error logging
            }
        }

        const canFallback = Boolean(fallback) && shouldTryFallback(err, primary);

        if (canFallback) {
            try {
                const conn = await connectOnce(fallback);
                console.log(`✅ MongoDB Connected (fallback): ${conn.connection.host}`);
                return;
            } catch (fallbackErr) {
                console.error("MongoDB connection error (fallback):", fallbackErr?.message || fallbackErr);
            }
        }

        console.error("MongoDB connection error:", err?.message || err);

        // In local dev, keep server alive so you can still hit non-DB routes.
        // In production, failing fast is usually better.
        if (process.env.NODE_ENV === "production") {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
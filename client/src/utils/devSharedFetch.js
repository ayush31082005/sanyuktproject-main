const inflightRequests = new Map();
const responseCache = new Map();

export const devSharedFetch = async (key, fetcher, ttlMs = 5000) => {
    if (import.meta.env.PROD) {
        return fetcher();
    }

    const now = Date.now();
    const cached = responseCache.get(key);
    if (cached && now - cached.timestamp <= ttlMs) {
        return cached.value;
    }

    const inflight = inflightRequests.get(key);
    if (inflight) {
        return inflight;
    }

    const requestPromise = Promise.resolve()
        .then(fetcher)
        .then((value) => {
            responseCache.set(key, { value, timestamp: Date.now() });
            inflightRequests.delete(key);
            return value;
        })
        .catch((error) => {
            inflightRequests.delete(key);
            throw error;
        });

    inflightRequests.set(key, requestPromise);
    return requestPromise;
};

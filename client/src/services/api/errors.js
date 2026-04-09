export const getErrorMessage = (error, fallbackMessage = "Something went wrong.") => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        fallbackMessage
    );
};

export const toApiError = (error, fallbackMessage) => {
    const normalizedError = new Error(getErrorMessage(error, fallbackMessage));
    normalizedError.status = error?.response?.status;
    normalizedError.data = error?.response?.data;
    normalizedError.response = error?.response;
    normalizedError.request = error?.request;
    normalizedError.originalError = error;
    return normalizedError;
};


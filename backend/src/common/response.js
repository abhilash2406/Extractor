export const goodResponse = (response = {}, message = '') => ({
    ...response,
    success: true,
    message,
    statusCode: 200,
});

export const failedResponse = (message = '', statusCode = 400, errorName = '') => ({
    success: false,
    message,
    statusCode,
    errorName,
});

export const badRequest = (message = '', statusCode = 400, errorName = 'BadRequest') => ({
    success: false,
    message,
    statusCode,
    errorName,
});


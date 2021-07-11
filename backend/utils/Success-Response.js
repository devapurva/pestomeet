export const pass = (message, result, statusCode) => {
    return ({
        "message": message,
        "result": result,
        "statusCode": statusCode
    });
};
export const fail = (message, result, statusCode) => {
    return ({
        "message": message,
        "result": result,
        "statusCode": statusCode
    });
};

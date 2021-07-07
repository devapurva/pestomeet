export const success = (message, result, statusCode) => {
    return ({
        "message": message,
        "result": result,
        "statusCode": statusCode
    });
};
export const error = (message, result, statusCode) => {
    return ({
        "message": message,
        "result": result,
        "statusCode": statusCode
    });
};

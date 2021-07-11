 export const pass = (message:any,result:any,statusCode:any)=>{
    return({
        "message":message,
        "result":result,
        "statusCode":statusCode
    })
 }

 export const fail = (message:any,result:any,statusCode:any)=>{
    return({
        "message":message,
        "result":result,
        "statusCode":statusCode
    })
 }

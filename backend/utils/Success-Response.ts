 export const success = (message:any,result:any,statusCode:any)=>{
    return({
        "message":message,
        "result":result,
        "statusCode":statusCode
    })
 }

 export const error = (message:any,result:any,statusCode:any)=>{
    return({
        "message":message,
        "result":result,
        "statusCode":statusCode
    })
 }

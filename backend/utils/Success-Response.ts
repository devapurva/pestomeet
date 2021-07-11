 export const message = (message:String,result:any,statusCode:boolean)=>{
    return({
        "message":message,
        "result":result,
        "statusCode":statusCode
    })
 }


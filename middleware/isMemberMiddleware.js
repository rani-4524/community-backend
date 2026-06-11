 export const isMemberMiddleware = (req,res,next) =>{
    try {
        if(req.user?.role != 'member')
            throw new Error("logged in user is not member of this community");
            
        next();
    } catch (error) {
        console.log(error);
        res.json({
            error:{
                message:"failed to fetch the api",
                info:error.message
            }
        })
        
    }
}
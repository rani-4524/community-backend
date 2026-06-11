
export const isHostMiddleware = (req,res,next) =>{
    try {
        if(req.user?.role !== 'host'){
            throw new Error("logged in user is not a host");
        }

        next();

    } catch (error) {
        return res.json({
            error:"failed to access host apis",
            info:error.message,
        }); 
    }
}
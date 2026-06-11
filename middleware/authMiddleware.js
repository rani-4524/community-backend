import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const authMiddleware = async (req,res,next) =>{
    try {
        // const token = req.cookies.token;
        const token =
            req.cookies?.token ||
            req.headers.authorization?.split(" ")[1];
        // console.log(token)

        if (!token) throw new Error("token not found in cookies");
    

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("DECODED:", decoded);
        // console.log("VERIFY SECRET:", process.env.JWT_SECRET);
        // const { email } = jwt.verify(token, process.env.JWT_SECRET);
    
        // const user = await User.findOne({ email });
        const user = await User.findOne({ email: decoded.email });

    
        if (!user) throw new Error("invalid payload");
    
        req.user = user;
        next();
        
    } catch (error) {
        console.log(error)
        res.json({
            error:{
                message:"failed to verify token",
                info:error.message
            },
            data:null
        })       
    }
   
}


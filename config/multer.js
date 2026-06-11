import multer from 'multer';

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null , 'profile_pictures/')
    },
    filename(req,file , cb){
        cb(null , Date.now() +"-" + file.originalname )
    }
    
})


// const fileFilter = (req, file ,cb)=>{
//     if(file.mimetype?.startsWith("image/")){
//         cb(null , true);
//     }else{
//         cb(new Error("only images are allowed as profile picture") , false)
//     }

// }

const uploadProfilePic = multer({storage } )
export default uploadProfilePic
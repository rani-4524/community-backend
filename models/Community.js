import mongoose from 'mongoose';

const communitySchema =new mongoose.Schema({
    name: {
        type:String,
        required : true,
        trim : true
    },

    description :{
        type : String,
        required : true,
        trim : true,
        maxLength : 500,
    },

    host : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "user",
    },

    category : {
        type : String ,
        enum : ['chess' , 'mern' , 'cooking' ,'sports','jobs' , 'politics' , 'tech' , 'health'],
        required : true,
    }

})

 const Community = mongoose.model("community" , communitySchema);
export default Community
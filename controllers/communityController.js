import  communityService  from "../services/communityService.js";

const createCommunity = async(req,res)=>{
    try {
        const {name , description  , category} = req.body;

        const host = req.user._id;

        await communityService.createCommunity({name , description , host , category});

        res.json({
            data:{
                message : "community created successfully",
            },
            error:null,
        });
    } catch (error) {
        console.log(error);
        res.json({
            error:{
                message:"failed to create community",
                info : error.message,
            },
            data : null,
        });
    }
}

const getAllCommunities = async(req,res)=>{
    try {

        const communities = await communityService.getAllCommunities();
        
        res.json({
            data:{
                message:"successfully fetch all communities",
                communities,
            },
            error:null
        })
    } catch (error) {
        console.log(error);
        res.json({
            error:{
            message:"failed to get all communities",
            info:error.message
        },
        data:null
        })
    }
}

const getSpecificCommunity = async(req,res)=>{
    try {
        const {communityId} = req.query;
        const community = await communityService.getSpecificCommunity(communityId)
        res.json({
            message:"successfully fetch the community",
            community
        })
    } catch (error) {
        console.log(error);
        res.json({
            error:{
                message:"failed to get this specific community",
                info:error.message
            },
            data:null
        })
        
    }
}

const getCommunityWithMembers = async(req,res)=>{
    try {
       
        const {id} = req.query;
        
        const community = await communityService.getCommunityWithMembers(id)
        
        res.json({
            data:{
                message:"successfully fetch the community with all members",
                community
            },
            error:null
        })
    } catch (error) {
        console.log(error);
        res.json({
            error:{
                message:" failed to get community with members",
                info:error.message
            },
            data:null
        })
        
    }

}

const deleteCommunity = async(req,res)=>{
    try {
        const {id} = req.params;

        const {_id : userId} = req.user;

        await communityService.deleteCommunity({id , userId});

        res.json({
            data:{
                message:"community deleted successfully",
            },
            error:null
        })
    } catch (error) {
        console.log(error);
        res.json({
            error:{
                message:"unable to delete this community",
                info:error.message
            },
            data:null
        })
    }
}

const getHostedCommunities = async(req,res)=>{
    try {
        const userId = req.user._id;
        const communities = await communityService.getHostedCommunities(userId);

        res.json({
            data:{
                message:"successfully fetch all hosted communities",
                communities,
            },
            error:null
        })
    } catch (error) {
        console.log(error);
        res.json({
            error:{
                message:"failed to fetch all hosted communities",
                info:error.message
            },
            data:null
        })
        
    }
}

export default {
    createCommunity,
    getAllCommunities,
    getSpecificCommunity,
    getCommunityWithMembers,
    deleteCommunity,
    getHostedCommunities
}
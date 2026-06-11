import eventService from "../services/eventService.js";


const createEvent = async (req , res) =>{
    try {
        const {name , description , communityId , city , venue , time,capacity} = req.body;
       
        const hostId = req.user._id;

        await eventService.createEvent({name , description , communityId , city , venue , time,capacity , hostId})

        res.json({
            data:{
                message: "event created successfully",
            },
            error:null
        })

    } catch (error) {
        console.log(error);
        res.json({
            error:{
                message:"failed to create event",
                info : error.message
            }
        })
    }
}



const getAllEvents =async (req,res)=>{
    try {
        const {city , keyword} = req.query;
       const events = await eventService.getAllEvents({city , keyword});

        res.json({
            data:{
                message:"successfully fetched the list of searched events",
                events
            },
            error:null
        })
    } catch (error) {
        console.log(error);
        res.json({
            error:{
                message:"failed to get all events",
                info:error.message
            },
            data:null
        })
        
    }

}

const getSpecificEvent = async(req,res)=>{
    try {

        const {id} = req.query;

        const event = await eventService.getSpecificEvent(id)
               
        res.json({
            data:{
                message:"successfully fetched the event",
                event
            },
            error:null
        })
    } catch (error) {
        console.log(error);
        res.json({
            error:{
                message:"failed to fetched the event",
                info:error.message
            },
            data:null
        })
    }
}

const deleteEvent = async(req,res) => {
    try {
        const {id} = req.params;

        await eventService.deleteEvent(id);

        return res.json({
            error:null,
            data:{
                message:"Event deleted successfully",
            },
        })
    } catch (error) {
        return res.json({
            error:{
                message:"failed to delete event",
                info:error.message,
            },
            data:null,
        })
    }
}
export default {
    createEvent,
    getAllEvents,
    getSpecificEvent,
    deleteEvent
}
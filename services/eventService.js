import mongoose from "mongoose";
import Event from "../models/Event.js";
import Community from "../models/Community.js";

const checkInputErros = ({
  name,
  description,
  communityId,
  city,
  venue,
  time,
}) => {
  const inputErrors = [];

  if (!name) inputErrors.push("Name is required");
  if (!description) inputErrors.push("description is required");
  if (description?.length > 1000)
    inputErrors.push("deacription length cannot be more than 1000");

  if (!communityId) inputErrors.push("communityId is required");
  if (!city) inputErrors.push("city is required");
  if (!venue) inputErrors.push("venue is required");

  if (!time) inputErrors.push("time is required");

  return inputErrors;
};

const createEvent = async ({
  name,
  description,
  communityId,
  city,
  venue,
  time,
  capacity,
  hostId,
}) => {
  const inputErrors = checkInputErros({
    name,
    description,
    communityId,
    city,
    venue,
    time,
    capacity,
    hostId,
  });
  if (inputErrors.length) throw new Error(inputErrors.join(", "));

  const community = await Community.findById(communityId);

  if (!community) throw new Error("community id is invalid ");

  if (community.host.toString() != hostId.toString())
    throw new Error(
      `current user is not host of this ${community.name} community`,
    );

  const event = new Event({
    name,
    description,
    communityId,
    city,
    venue,
    time,
  });
  if (capacity) event.capacity = capacity;

  await event.save();
};

const getAllEvents = async ({ city, keyword }) => {
  const filter = {};
  // time: { $gte: new Date() },

  if (city) filter.city = { $regex: city, $options: "i" };

  if (keyword)
    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];

  const events = await Event.find(filter);
  return events;
};

const deleteEvent = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid event id");
  }

  const event = await Event.findById(id);

  if (!event) {
    throw new Error("Event not found");
  }

  await Event.findByIdAndDelete(id);
};

const getSpecificEvent = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("given object id is not valid mongoose id");

  const event = await Event.findById(id).populate({
    path: "communityId",
    select: "name _id",
    populate: {
      path: "host",
      select: "name",
    },
  });

  if (!event) throw new Error("no event found with given id");

  return event;
};

export default {
  createEvent,
  getAllEvents,
  getSpecificEvent,
  deleteEvent,
};

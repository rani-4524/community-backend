import mongoose from "mongoose";
import Community from "../models/Community.js";
import User from "../models/User.js";
import Event from "../models/Event.js";

const createCommunity = async ({ name, description, host, category }) => {
  const inputErrors = [];

  if (!name) inputErrors.push("Name is required");
  if (!description) inputErrors.push("description is required");
  if (!host) inputErrors.push("host is required");
  if (!category) inputErrors.push("category is required");

  if (inputErrors.length) throw new Error(inputErrors.join(", "));

  if (!mongoose.Types.ObjectId.isValid(host)) {
    throw new Error("host id is not a valid objectId");
  }

  const community = await new Community({
    name,
    description,
    host,
    category,
  }).save();

  const updatedUser = await User.findByIdAndUpdate(
    host,
    {
      $push: { hostedCommunities: community._id },
    },
    { new: true },
  );

  return community;
};

const getAllCommunities = async () => {
  const communities = await Community.find()
    .populate({
      path: "host",
      select: "name -_id",
    })
    .lean();
  return communities;
};

const getSpecificCommunity = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("community is is not valid");
  const community = await Community.findById(id)
    .populate({
      path: "host",
      select: "name -_id",
    })
    .lean();

  /* 
    IF WE WANT TO MANIPUALTE DATA , WE CAN DO THAT
    community.host = community.host.name
    */
  return community;
};

const getCommunityWithMembers = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("community id is not a valid mongoose Object Id");

  const community = await Community.findById(id);

  if (!community) throw new Error("no community exists with this id");

  const members = await User.find({
    joinedCommunities: id,
  }).lean();

  //$in checks if any element matches
  // const members = await User.find({
  //     joinCommunities:{
  //         $in : [id , ''],
  //     },
  // }).lean();

  //$all check if all elements matches

  return members;
};

const deleteCommunity = async ({ id, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("given community id is not valid");

  const community = await Community.findById(id).lean();

  if (community?.host.toString() != userId.toString())
    throw new Error("current user is not the host of this community");

  if (!community) throw new Error("no community exists with this id");

  await Community.findByIdAndDelete(id);

  await Event.deleteMany({ communityId: id });

  await User.updateMany(
    { joinCommunities: id },
    {
      $pull: { joinCommunities: id },
    },
  );
};

const getHostedCommunities = async (userId) => {
  if (!userId) throw new Error("user id is required");

  const communities = await Community.find({ host: userId }).select("_id name");

  return communities;
};

export default {
  createCommunity,
  getAllCommunities,
  getSpecificCommunity,
  getCommunityWithMembers,
  deleteCommunity,
  getHostedCommunities,
};

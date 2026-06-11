import User from "../models/User.js";
import Community from "../models/Community.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Event from "../models/Event.js";

const registerUser = async ({ name, email, password }) => {
  const inputErrors = [];
  if (!name) inputErrors.push("Name is required");
  if (!email) inputErrors.push("Email is required");
  if (!password) inputErrors.push("Password is required");

  if (password?.length < 6)
    inputErrors.push("Password lengt must be atleast 6 characters");

  if (name.length < 10 || name.length > 100)
    inputErrors.push("Name length must be in range [10,100]");

  const existingUser = await User.findOne({ email: email });

  if (existingUser) inputErrors.push(`Email: ${email} alredy exists`);

  if (inputErrors.length) throw new Error(inputErrors.join(", "));

  // If  we are reaching this line of code , then theres no input errors and we can  safe
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    hashedPassword,
  });
  if (!name) throw new Error("name is empty");
  await user.save();

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, user };
};

const loginUser = async ({ email, password }) => {
  const inputErrors = [];

  if (!email) inputErrors.push("Email is required");
  if (!password) inputErrors.push("Password is required");

  if (password?.length < 6)
    inputErrors.push("Password lengt must be atleast 6 characters");

  if (inputErrors.length) throw new Error(inputErrors.join(", "));

  const existingUser = await User.findOne({ email }).select("+hashedPassword");

  if (!existingUser) throw new Error("User not found");

  const validatePassword = await bcrypt.compare(
    password,
    existingUser.hashedPassword,
  );

  if (!validatePassword) throw new Error("Invalid Password");

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const user = existingUser;
  return { token, user };
};

const joinCommunity = async ({ userId, communityId }) => {
  if (!communityId) {
    throw new Error("community id is not valid");
  }

  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    throw new Error("community id is not a valid objectId");
  }

  const existingCommunity = await Community.findById(communityId);

  if (!existingCommunity) {
    throw new Error("community id is not valid");
  }

  await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        joinCommunities: communityId,
      },
    },
    { new: true },
  );
};

const makeHost = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $set: {
      role: "host",
    },
  });
};

const profile = async (user) => {
  const hostedCommunities = await Community.find({
    host: user._id,
  });

  return {
    ...user.toObject(),
    hostedCommunities,
  };
};

const leaveCommunity = async ({ id, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("given id s not a valid mongoose id");

  const community = await Community.findById(id);

  if (!community) throw new Error("no community exists with this id");

  await User.findByIdAndUpdate(userId, {
    $pull: {
      joinCommunities: id,
    },
  });
};

const dashboard = async (id) => {
  const dashboard = await User.findById(id)
    .select("name role joinCommunities rsvpedEvents")
    .populate({ path: "joinCommunities", select: "name category" })
    .populate({
      path: "rsvpedEvents",
      select: "name city time mode",
      populate: {
        path: "communityId",
        select: "name",
      },
    });

  return dashboard;
};

const hostDashboard = async (id) => {
  const hostDashboard = await User.findById(id)
    .select("name role joinCommunities rsvpedEvents")
    .populate({ path: "joinCommunities", select: "name category" })
    .populate({
      path: "rsvpedEvents",
      select: "name city time mode",
      populate: {
        path: "communityId",
        select: "name",
      },
    })
    .lean();

  const hostedCommunities = await Community.find({ host: id });

  const createdEvents = await Event.find({
    communityId: {
      $in: hostedCommunities.map((community) => community._id),
    },
  });

  hostDashboard.createdEvents = createdEvents;

  hostDashboard.hostedCommunities = hostedCommunities;

  return hostDashboard;
};

const rsvpToggle = async ({ user, eventId }) => {
  const isEventAlreadyRSVPed = user.rsvpedEvents.includes(eventId);

  if (isEventAlreadyRSVPed) {
    user.rsvpedEvents.pull(eventId);
  } else {
    user.rsvpedEvents.push(eventId);
  }
  await user.save();
};

const uploadProfilePic = async ({ userId, profileFilePath }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { profilePicUrl: profileFilePath },
    { returnDocument: "after" },
  );
};
export default {
  registerUser,
  loginUser,
  joinCommunity,
  makeHost,
  profile,
  leaveCommunity,
  dashboard,
  hostDashboard,
  rsvpToggle,
  uploadProfilePic,
};

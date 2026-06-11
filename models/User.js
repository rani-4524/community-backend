import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 10,
    maxLength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  hashedPassword: {
    type: String,
    required: true,
    select: false,
    minLength: 6,
  },
  role: {
    type: String,
    enum: ["host", "member"],
    default: "member",
  },
  profilePicUrl:{
    type:String,
    default:"",
  },
  joinCommunities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "community",
    },
  ],
  rsvpedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
    },
  ],
});

const User = mongoose.model("user", userSchema);
export default User;
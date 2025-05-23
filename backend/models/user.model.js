import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlenght: 6,
  },
  followers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }
  ],
  following: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }
  ],
  profilePic: {
    type: String,
    default: "",
  },
  coverPic: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "",
  },
  likedblogs:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        default: []
    }
  ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
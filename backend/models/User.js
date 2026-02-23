const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    mname: { type: String },
    lname: { type: String, required: true },
    fullName: { type: String },
    mobile: { type: String, required: true },
    photoUrl: { type: String },
    photoId: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

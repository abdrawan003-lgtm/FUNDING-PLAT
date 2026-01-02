import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountType: { type: String, enum: ["supporter", "requester"], required: true },
      isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  
  savedProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    }
  ],
  

type: {
  type: String,
  enum: ["personal", "company", "organization", "government"],
  default: "personal"
},
isSupporter: {
  type: Boolean,
  default: false, // غير داعم بشكل افتراضي
},
notifications: [
  {
    type: {
      type: String,
        enum: ["like", "activity", "save"],
    },
    message: String,
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],

  interests: [
  {
    name: String,
    weight: { type: Number, default: 1 },
  },
],

  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function(enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

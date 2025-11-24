import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true 
    },

    password: { 
      type: String, 
      required: true 
    }
  },
  {
    timestamps: true // يضيف createdAt و updatedAt
  }
);

// Hash password before saving لمطابقة كلمة المرور قبل الحفظ
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next(); // إذا ما تغيرت الباسوورد لا تعمل hash
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords مقارنة كلمة المرور
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

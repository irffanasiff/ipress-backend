import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// a user model is created
const userSchema = new mongoose.Schema(
  {
    name: {
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
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    resetPasswordLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.isValidPassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

userSchema.pre("validate", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// a user model is exported
export default mongoose.model("User", userSchema);

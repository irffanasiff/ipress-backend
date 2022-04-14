import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  },
  {
    timestamps: true,
  }
);

userSchema.methods.isValidPassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

// a user model is exported
export default mongoose.model('User', userSchema);

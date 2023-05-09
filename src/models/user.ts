import { Schema, Document, model } from "mongoose";
import bcryptjs from "bcryptjs";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash the user's password before saving it to the database
UserSchema.pre<IUser>("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(user.password, salt);
  user.password = hash;
  next();
});

export default model<IUser>("User", UserSchema);

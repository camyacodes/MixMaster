import { model, Schema } from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

// 3. Create a Model.
const User = model<IUser>("User", userSchema);

export default User;

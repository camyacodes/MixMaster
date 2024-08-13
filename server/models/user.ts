import mongoose, { model, Schema } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
// interface IUser {
//   name: String;
//   username: String;
//   email: String;
//   passwordHash: string;
//   setlists: Types.ObjectId[];
// }

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  setlists: [{ type: mongoose.SchemaTypes.ObjectId, ref: "SetList" }],
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
const User = model("User", userSchema);

export default User;

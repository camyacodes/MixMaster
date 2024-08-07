import mongoose, { model, Schema } from "mongoose";

// interface Song {
//   name: String;
//   intro_bpm?: Number;
//   outro_bpm?: Number;
//   transition?: String;
// }

// interface SetList {
//   name: String;
//   songs: Song[];
//   user: Types.ObjectId[];
// }

const songSchema = new Schema({
  name: { type: String, required: true },
  intro_bpm: Number,
  outro_bpm: Number,
  transition: String,
});

const setlistSchema = new Schema({
  name: { type: String, required: true },
  songs: [songSchema],
  user: { type: mongoose.SchemaTypes.ObjectId, ref: "User " },
});

setlistSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const SetList = model("SetList", setlistSchema);

export default SetList;

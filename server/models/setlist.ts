import mongoose, { model, Schema } from "mongoose";
import User from "./user";

interface Song {
  name: String;
  intro_bpm?: Number;
  outro_bpm?: Number;
  transition?: String;
}

interface SetList {
  name: String;
  songs: Song[];
  userId: String;
}

const songSchema = new Schema<Song>({
  name: { type: String, require: true },
  intro_bpm: Number,
  outro_bpm: Number,
  transition: String,
});

const setlistSchema = new Schema<SetList>({
  name: { type: String, require: true },
  songs: [songSchema],
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: User },
});

setlistSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const SetList = model<SetList>("SetList", setlistSchema);

export default SetList;

import mongoose, { model, Schema } from "mongoose";
import User from "./user";

interface SetList {
  name: String;
  songs: [
    {
      name: String;
      intro_bpm: Number;
      outro_bpm: Number;
      transition: String;
    }
  ];
  userId: String;
}

const setlistSchema = new Schema<SetList>({
  name: { type: String, require: true },
  songs: [
    {
      name: { type: String, require: true },
      intro_bpm: Number,
      outro_bpm: Number,
      transition: String,
    },
  ],
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: User },
});

const SetList = model<SetList>("SetList", setlistSchema);

export default SetList;

import User from "../models/user";
import SetList from "../models/setlist";

export const emptySet = {
  name: "first setlist",
};

export const initialSetlist = {
  name: "My DJ Setlist",
  songs: [
    {
      name: "Song One",
      intro_bpm: 120,
      outro_bpm: 125,
      transition: "fade",
    },
    {
      name: "Song Two",
      intro_bpm: 125,
      outro_bpm: 130,
      transition: "cut",
    },
  ],
};

export const mockSet = {
  name: "Electronic Essentials",
  songs: [
    {
      name: "Synth Wave",
      intro_bpm: 140,
      outro_bpm: 145,
      transition: "filter",
    },
    {
      name: "Electro Groove",
      intro_bpm: 145,
      outro_bpm: 150,
      transition: "drop",
    },
  ],
};

export const usersInDB = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

export const setlistsInDB = async () => {
  const setlists = await SetList.find({});
  return setlists.map((s) => s.toJSON());
};

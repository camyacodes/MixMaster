import express from "express";
import SetList from "../models/setlist";
// import User from "../models/user";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, songs } = req.body;

  const createdSetlist = new SetList({
    name,
    songs,
  });

  await createdSetlist.save();

  res.status(201).json(createdSetlist);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const song = req.body;

  const setlist = await SetList.findById(id);

  if (!setlist) {
    return res.status(404).json({ error: "setlist not found" });
  }

  setlist.songs = setlist?.songs.concat(song);

  const results = await setlist.save();

  return res.status(200).json(results);
});

export default router;

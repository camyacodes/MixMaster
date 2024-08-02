import express from "express";
import SetList from "../models/setlist";

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

export default router;

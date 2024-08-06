import express from "express";
import SetList from "../models/setlist";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";
import { Response } from "express-serve-static-core";

const router = express.Router();

const getTokenFrom = (
  request: { get: (arg0: string) => any },
  response: Response<any, Record<string, any>, number>
) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  } else {
    return response.status(401).json({ error: "User not logged in" });
  }
};

router.post("/", async (req, res) => {
  const body = req.body;

  const token: string = getTokenFrom(req, res) || "";
  // console.log(req.headers);

  const secret = process.env.SECRET;

  const decodedToken = jwt.verify(token, secret as string) as JwtPayload;
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return res.status(401).json({ error: "user not found in system" });
  }

  const createdSetlist = new SetList({
    name: body.name,
    songs: body.songs,
    user: user.id,
  });

  await createdSetlist.save();

  return res.status(201).json(createdSetlist);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const songs = req.body;

  const setlist = await SetList.findById(id);

  if (!setlist) {
    return res.status(404).json({ error: "setlist not found" });
  }

  setlist.songs = setlist?.songs.concat(songs);

  const results = await setlist.save();

  return res.status(200).json(results);
});

export default router;

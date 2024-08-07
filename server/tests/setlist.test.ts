import supertest from "supertest";
import app from "../app";
import bcrypt from "bcrypt";
import User from "../models/user";
import SetList from "../models/setlist";
import {
  initialSetlist,
  mockSet,
  setlistsInDB,
  emptySet,
} from "./test_helpers";

const api = supertest(app);

let initialSetId = "";
// let testUserId = "";
beforeEach(async () => {
  // create set and user
  await SetList.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);

  const initialUser = new User({
    name: "Joe Johnson",
    username: "joej",
    email: "joej@example.com",
    passwordHash,
  });

  await initialUser.save();
  // testUserId = initialUser.id;
  console.log("User seeded");

  const firstSetlist = new SetList(initialSetlist);

  await firstSetlist.save();
  initialSetId = firstSetlist.id;
  console.log("Setlist seeded");
});

describe("creating a setlist", () => {
  test("suceeds with the correct data and user logged in", async () => {
    const setsBefore = await setlistsInDB();

    const setlist = emptySet;
    // logged in user
    // api call to login with user
    //get token
    const user = await api
      .post("/api/login")
      .send({ username: "joej", password: "sekret" })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const token = user.body.token;

    // console.log(config);
    // console.log("token for creating setlist", token);
    // add token to request body
    const results = await api
      .post("/api/setlists")
      .set("Authorization", "Bearer " + token)
      .send(setlist)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const setsAfter = await setlistsInDB();

    // console.log(
    //   "setlist user id",
    //   results.body.user,
    //   "Actual user id",
    //   user.body.id
    // );
    expect(setsAfter.length).toEqual(setsBefore.length + 1);
    expect(setsAfter[1].name).toContain("first setlist");
    expect(results.body.user).toContain(user.body.id);
  });

  test("fails with out user logged in", async () => {
    const setsBefore = await setlistsInDB();

    const setlist = mockSet;

    await api
      .post("/api/setlists")
      .set("Authorization", "")
      .send(setlist)
      .expect(401)
      .expect("Content-Type", /application\/json/);
    const setsAfter = await setlistsInDB();

    expect(setsAfter.length).toEqual(setsBefore.length);
  });
});

describe("songs can be", () => {
  test("added to a setlist", async () => {
    // console.log("set id", initialSetId);
    const setlistBefore = await SetList.findById(initialSetId);

    const song = [
      {
        name: "Woo",
        intro_bpm: 95,
        outro_bpm: 100,
        transition: "fade",
      },
      {
        name: "Umbrella",
        intro_bpm: 75,
        outro_bpm: 170,
        transition: "echo out",
      },
    ];

    await api
      .put(`/api/setlists/${initialSetId}`)
      .send(song)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const setlistAfter = await SetList.findById(initialSetId);

    expect(setlistAfter?.songs.length).toEqual(
      setlistBefore!.songs.length + song.length
    );
    // expect(setlistAfter?.songs[setlistAfter.songs.length - 1].name).toBe(
    //   "Umbrella"
    // );
  });
});

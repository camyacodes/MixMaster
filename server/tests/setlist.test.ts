import supertest from "supertest";
import app from "../app";
// import User from "../models/user";
import SetList from "../models/setlist";
import { initialSetlist, setlistsInDB, mockSet } from "./test_helpers";

const api = supertest(app);

let initialSetId = "";
beforeEach(async () => {
  await SetList.deleteMany({});

  const firstSetlist = new SetList(initialSetlist);

  await firstSetlist.save();
  initialSetId = firstSetlist.id;
  console.log("Setlist seeded");
});

describe("creating a setlist", () => {
  test("suceeds with the correct data", async () => {
    const setsBefore = await setlistsInDB();

    const setlist = mockSet;

    await api
      .post("/api/setlists")
      .send(setlist)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const setsAfter = await setlistsInDB();

    expect(setsAfter.length).toEqual(setsBefore.length + 1);
    expect(setsAfter[1].name).toContain("Electronic Essentials");
  });

  test("fails with amissing name", async () => {
    const setsBefore = await setlistsInDB();

    const setlist = {};

    await api.post("/api/setlists").send(setlist).expect(400);

    const setsAfter = await setlistsInDB();

    expect(setsAfter.length).toEqual(setsBefore.length);
  });
});

describe("songs can be", () => {
  test.only("added to a setlist", async () => {
    console.log("set id", initialSetId);
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
    expect(setlistAfter?.songs[setlistAfter.songs.length - 1].name).toBe(
      "Umbrella"
    );
  });
});
// songs can be removed
// delete song

// songs can be added
// put song

// songs can be reorganized
// put setlist

// songs can be updated
// put song

// users can create a setlist
// post setlist

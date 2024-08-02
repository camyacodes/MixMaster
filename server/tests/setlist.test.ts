import supertest from "supertest";
import app from "../app";
// import User from "../models/user";
import SetList from "../models/setlist";
import { initialSetlist, setlistsInDB, mockSet } from "./test_helpers";

const api = supertest(app);
beforeEach(async () => {
  await SetList.deleteMany({});

  const firstSetlist = new SetList(initialSetlist);

  await firstSetlist.save();

  console.log("Setlist seeded");
});

describe("a setlist", () => {
  test("can be created", async () => {
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
});
// songs can be removed
// delete song

// songs can be added
// post song

// songs can be reorganized
// put setlist

// songs can be updated
// put song

// users can create a setlist
// post setlist

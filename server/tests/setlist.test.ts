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

// Runs before each test to reset the setlist and user collections and add initial data
beforeEach(async () => {
  await SetList.deleteMany({});
  await User.deleteMany({});

  // Create a password hash for the initial user
  const passwordHash = await bcrypt.hash("sekret", 10);

  // Create and save the initial user in the database
  const initialUser = new User({
    name: "Joe Johnson",
    username: "joej",
    email: "joej@example.com",
    passwordHash,
  });

  await initialUser.save();
  console.log("User seeded");

  // Create and save the initial setlist in the database
  const firstSetlist = new SetList(initialSetlist);

  await firstSetlist.save();
  initialSetId = firstSetlist.id;
  console.log("Setlist seeded");
});

describe("Creating a setlist", () => {
  test("succeeds with the correct data and user logged in", async () => {
    const setsBefore = await setlistsInDB(); // Get the list of setlists before the test

    const setlist = emptySet; // Define an empty setlist

    // Log in the user to get a token
    const user = await api
      .post("/api/login")
      .send({ username: "joej", password: "sekret" })
      .expect(200) // Expect a 200 OK status code
      .expect("Content-Type", /application\/json/); // Expect the response to be in JSON format

    const token = user.body.token; // Extract the token from the response

    // Send a POST request to create a new setlist with the token
    const results = await api
      .post("/api/setlists")
      .set("Authorization", "Bearer " + token) // Set the Authorization header with the token
      .send(setlist)
      .expect(201) // Expect a 201 Created status code
      .expect("Content-Type", /application\/json/); // Expect the response to be in JSON format

    const setsAfter = await setlistsInDB(); // Get the list of setlists after the test

    // Check that the number of setlists has increased by one
    expect(setsAfter.length).toEqual(setsBefore.length + 1);

    // Check that the new setlist has the correct name and user ID
    expect(setsAfter[1].name).toContain("first setlist");
    expect(results.body.user).toContain(user.body.id);
  });

  test("fails without user logged in", async () => {
    const setsBefore = await setlistsInDB(); // Get the list of setlists before the test

    const setlist = mockSet; // Define a mock setlist

    // Send a POST request to create a new setlist without a token
    await api
      .post("/api/setlists")
      .set("Authorization", "") // No token provided
      .send(setlist)
      .expect(401) // Expect a 401 Unauthorized status code
      .expect("Content-Type", /application\/json/); // Expect the response to be in JSON format

    const setsAfter = await setlistsInDB(); // Get the list of setlists after the test

    // Check that no new setlist was added
    expect(setsAfter.length).toEqual(setsBefore.length);
  });
});

describe("Songs can be", () => {
  test("added to a setlist", async () => {
    const setlistBefore = await SetList.findById(initialSetId); // Get the setlist before adding songs

    // Define songs to be added to the setlist
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

    // Send a PUT request to add songs to the setlist
    await api
      .put(`/api/setlists/${initialSetId}`)
      .send(song)
      .expect(200) // Expect a 200 OK status code
      .expect("Content-Type", /application\/json/); // Expect the response to be in JSON format

    const setlistAfter = await SetList.findById(initialSetId); // Get the setlist after adding songs

    // Check that the number of songs in the setlist has increased by the number of songs added
    expect(setlistAfter?.songs.length).toEqual(
      setlistBefore!.songs.length + song.length
    );
  });
});

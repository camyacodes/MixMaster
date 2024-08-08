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

let token: string; // Token used for authentication in tests
let initialSetId: string; // ID of the initial setlist used in tests
let initialUserId: string;

// Runs before each test to set up the database with fresh data
beforeEach(async () => {
  // Clear all setlists and users from the database
  await SetList.deleteMany({});
  await User.deleteMany({});

  // Hash the password for the initial user
  const passwordHash = await bcrypt.hash("sekret", 10);

  // Create a new user with the hashed password
  const initialUser = new User({
    name: "Joe Johnson",
    username: "joej",
    email: "joej@example.com",
    passwordHash,
  });

  // Save the user to the database
  await initialUser.save();
  initialUserId = initialUser._id.toString();
  // Log in as the user to get an authentication token
  const user = await api
    .post("/api/login")
    .send({ username: "joej", password: "sekret" })
    .expect(200) // Expect a successful login
    .expect("Content-Type", /application\/json/); // Expect JSON response

  token = user.body.token; // Store the authentication token

  // Create an initial setlist associated with the initial user
  const firstSetlist = new SetList({
    ...initialSetlist,
    user: initialUser._id,
  });
  await firstSetlist.save(); // Save the setlist to the database
  initialSetId = firstSetlist._id.toString(); // Store the ID of the initial setlist
});

describe("Creating a setlist", () => {
  test("succeeds with the correct data and user logged in", async () => {
    // Get the list of setlists before creating a new one
    const setsBefore = await setlistsInDB();

    // Define an empty setlist to be created
    const setlist = emptySet;

    // Send a POST request to create a new setlist with the authentication token
    const results = await api
      .post("/api/setlists")
      .set("Authorization", `Bearer ${token}`) // Include the token in the request header
      .send(setlist) // Send the setlist data
      .expect(201) // Expect successful creation
      .expect("Content-Type", /application\/json/); // Expect JSON response

    // Get the list of setlists after creation
    const setsAfter = await setlistsInDB();

    // Verify that the number of setlists has increased by one
    expect(setsAfter.length).toEqual(setsBefore.length + 1);
    // Verify that the new setlist has the correct name
    expect(setsAfter[setsAfter.length - 1].name).toContain("first setlist");
    // Verify that the new setlist is associated with the correct user
    expect(results.body.user).toContain(results.body.user);
  });

  test("fails without user logged in", async () => {
    // Get the list of setlists before attempting to create a new one
    const setsBefore = await setlistsInDB();

    // Define a mock setlist to be created
    const setlist = mockSet;

    // Send a POST request to create a new setlist without authentication
    await api
      .post("/api/setlists")
      .set("Authorization", "") // No token provided
      .send(setlist) // Send the setlist data
      .expect(401) // Expect unauthorized error
      .expect("Content-Type", /application\/json/); // Expect JSON response

    // Get the list of setlists after the attempt
    const setsAfter = await setlistsInDB();

    // Verify that no new setlist was added
    expect(setsAfter.length).toEqual(setsBefore.length);
  });
});

describe("Unwanted setlists can be", () => {
  test.only("deleted", async () => {
    // Create a new setlist to work with
    const setlistToDelete = new SetList({
      name: "Temporary Setlist",
      songs: [
        {
          name: "Song To Remove",
          intro_bpm: 100,
          outro_bpm: 105,
          transition: "fade",
        },
      ],
      user: initialUserId, // User ID or a valid user reference
    });
    await setlistToDelete.save();

    const setId = setlistToDelete._id.toString();
    console.log(setId);

    await api.delete(`/api/setlists/${setId}`).expect(204); // Expect successful deletion with no content

    // Verify that the setlist has been deleted
    const setlistAfter = await SetList.findById(setId);
    expect(setlistAfter).toBeNull(); // Expect that the setlist no longer exists;
  });
});

describe("Songs can be", () => {
  test("added to a setlist", async () => {
    // Find the setlist before adding songs
    const setlistBefore = await SetList.findById(initialSetId);

    if (!setlistBefore) {
      // If the setlist is not found, fail the test with an appropriate message
      throw new Error("Setlist not found");
    }

    // Define songs to be added to the setlist
    const songsToAdd = [
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
      .set("Authorization", `Bearer ${token}`) // Include the token in the request header
      .send(songsToAdd) // Send the songs data
      .expect(200) // Expect successful update
      .expect("Content-Type", /application\/json/); // Expect JSON response

    // Find the setlist after adding songs
    const setlistAfter = await SetList.findById(initialSetId);

    // Verify that the number of songs in the setlist has increased
    expect(setlistAfter?.songs.length).toEqual(
      setlistBefore.songs.length + songsToAdd.length
    );
  });

  test("deleted from a setlist", async () => {
    // Implement the test for deleting songs from a setlist
  });
});

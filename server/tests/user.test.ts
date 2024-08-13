/* eslint-disable @typescript-eslint/no-non-null-assertion */
import supertest = require("supertest");
import bcrypt from "bcrypt";
import app from "../app";
import User from "../models/user";
import { initialSetlist, usersInDB } from "./test_helpers";

const api = supertest(app);

// Runs before each test to reset the user collection and add an initial user
beforeEach(async () => {
  await User.deleteMany({});

  // Create a password hash for the initial user
  const passwordHash = await bcrypt.hash("sekret", 10);

  // Create and save the initial user in the database
  const initialUser = new User({
    name: "Alice Johnson",
    email: "alicej@example.com",
    passwordHash,
  });

  await initialUser.save();
});

describe("Creating a user", () => {
  test("should be successful with a fresh username", async () => {
    const usersBefore = await usersInDB(); // Get the list of users before the test

    // Define a new user to be saved to the database
    let savedUser = {
      name: "Bill",
      email: "bill@initech.com",
      password: "123abc",
    };

    // Send a POST request to create a new user
    await api
      .post("/api/users")
      .send(savedUser)
      .expect(201) // Expect a 201 Created status code
      .expect("Content-Type", /application\/json/); // Expect the response to be in JSON format

    const usersAfter = await usersInDB(); // Get the list of users after the test
    const emails = usersAfter.map((u) => u.email); // Extract emails from the list of users

    // Check that the number of users has increased by one
    expect(usersAfter.length).toEqual(usersBefore.length + 1);

    // Check that the new username exists in the database
    expect(emails).toContain("djBill76");
  });

  test("should fail if username already exists", async () => {
    const usersBefore = await usersInDB(); // Get the list of users before the test

    // Define a user with a duplicate username
    let dupUser = {
      name: "Alice Johnson",
      username: "alicej",
      email: "alicej@example.com",
      password: "123abc",
    };

    // Send a POST request to create a user with a duplicate username
    const result = await api
      .post("/api/users")
      .send(dupUser)
      .expect(400) // Expect a 400 Bad Request status code
      .expect("Content-Type", /application\/json/); // Expect the response to be in JSON format

    const usersAfter = await usersInDB(); // Get the list of users after the test

    // Check that the error message is correct and no new user was added
    expect(result.body.error).toEqual("username already taken");
    expect(usersAfter.length).toEqual(usersBefore.length);
  });

  test("should fail if email, name, or password is missing", async () => {
    const usersBefore = await usersInDB(); // Get the list of users before the test

    // Define a user with missing fields
    const user = {
      email: "mymy@gmail.com",
      password: "abc123",
    };

    // Send a POST request to create a user with missing fields
    await api
      .post("/api/users")
      .send(user)
      .expect(400) // Expect a 400 Bad Request status code
      .expect("Content-Type", /application\/json/); // Expect the response to be in JSON format

    const usersAfter = await usersInDB(); // Get the list of users after the test

    // Check that no new user was added
    expect(usersAfter.length).toEqual(usersBefore.length);
  });
});

describe("Logging in a user", () => {
  test("should succeed with a token", async () => {
    // Define a user with correct credentials
    const user = {
      username: "alicej",
      password: "sekret",
    };

    // Send a POST request to log in the user
    const loginUser = await api
      .post("/api/login")
      .send(user)
      .expect(200) // Expect a 200 OK status code
      .expect("Content-Type", /application\/json/); // Expect the response to be in JSON format

    // Check that a token is returned
    expect(loginUser.body.token).toBeDefined();
  });

  describe("Getting a user's setlists", () => {
    test("succeeds with a valid user id in request", async () => {
      const setlist = initialSetlist; // Initial setlist data
      // Log in the user to get a token
      const user = await api
        .post("/api/login")
        .send({ username: "alicej", password: "sekret" })
        .expect(200) // Expect a 200 OK status code
        .expect("Content-Type", /application\/json/); // Expect the response to be in JSON format

      const token = user.body.token; // Extract the token from the response

      // Send a POST request to create a setlist with the token
      await api
        .post("/api/setlists")
        .set("Authorization", "Bearer " + token) // Set the Authorization header with the token
        .send(setlist)
        .expect(201) // Expect a 201 Created status code
        .expect("Content-Type", /application\/json/); // Expect the response to be in JSON format

      // Send a GET request to get the user's setlists
      const userSets = await api
        .get(`/api/users/${user.body.id}`)
        .expect(200) // Expect a 200 OK status code
        .expect("Content-Type", /application\/json/); // Expect the response to be in JSON format

      // Check that the setlist name is correct
      expect(userSets.body.setlists[0].name).toContain("My DJ Setlist");
    });
  });
});

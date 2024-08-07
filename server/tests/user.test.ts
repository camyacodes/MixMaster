/* eslint-disable @typescript-eslint/no-non-null-assertion */
import supertest = require("supertest");
import bcrypt from "bcrypt";
import app from "../app";
import User from "../models/user";
import { initialSetlist, usersInDB } from "./test_helpers";

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);

  const initialUser = new User({
    name: "Alice Johnson",
    username: "alicej",
    email: "alicej@example.com",
    passwordHash,
  });

  await initialUser.save();
});

describe("Creating a user", () => {
  test("should be sucessful with a fresh username", async () => {
    const usersBefore = await usersInDB();
    // save user to db
    let savedUser = {
      name: "Bill",
      username: "djBill76",
      email: "bill@initech.com",
      password: "123abc",
    };

    await api
      .post("/api/users")
      .send(savedUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAfter = await usersInDB();
    const usernames = usersAfter.map((u) => u.username);

    // expect db size to increase
    expect(usersAfter.length).toEqual(usersBefore.length + 1);

    expect(usernames).toContain("djBill76");
    // check for username in database
  });

  test("should fail if username already exists", async () => {
    const usersBefore = await usersInDB();

    let dupUser = {
      name: "Alice Johnson",
      username: "alicej",
      email: "alicej@example.com",
      password: "123abc",
    };

    const result = await api
      .post("/api/users")
      .send(dupUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAfter = await usersInDB();

    expect(result.body.error).toEqual("username already taken");
    expect(usersAfter.length).toEqual(usersBefore.length);
  });
  test("should fail if email, name, or username is missing", async () => {
    const usersBefore = await usersInDB();

    const user = {
      email: "mymy@gmail.com",
      password: "abc123",
    };

    await api
      .post("/api/users")
      .send(user)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAfter = await usersInDB();

    expect(usersAfter.length).toEqual(usersBefore.length);
  });
});
describe("logging in a user", () => {
  test("should succeed with a token", async () => {
    const user = {
      username: "alicej",
      password: "sekret",
    };

    const loginUser = await api
      .post("/api/login")
      .send(user)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(loginUser.body.token).toBeDefined();
  });

  describe("Getting a users setlists", () => {
    test("suceeds with a valid user id in req", async () => {
      const setlist = initialSetlist;
      const user = await api
        .post("/api/login")
        .send({ username: "alicej", password: "sekret" })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const token = user.body.token;

      // console.log(config);
      // console.log("token for creating setlist", token);
      // add token to request body
      await api
        .post("/api/setlists")
        .set("Authorization", "Bearer " + token)
        .send(setlist)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // get req with user id param
      // return all setlists that user has
      const userSets = await api
        .get(`/api/users/${user.body.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(userSets.body.setlists[0].name).toContain("My DJ Setlist");
    });
  });
});

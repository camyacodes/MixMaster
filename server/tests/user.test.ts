/* eslint-disable @typescript-eslint/no-non-null-assertion */
import supertest = require("supertest");
import bcrypt from "bcrypt";
import app from "../app";
import User from "../models/user";
import { usersInDB } from "./test_helpers";

const api = supertest(app);

describe("Creating a user", () => {
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

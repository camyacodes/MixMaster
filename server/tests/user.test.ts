/* eslint-disable @typescript-eslint/no-non-null-assertion */
import supertest = require("supertest");
import app from "../app";

const api = supertest(app);

describe("A user", () => {
  test("should successfully be created", async () => {
    let savedUser = {
      name: "Bill",
      username: "djBill76",
      email: "bill@initech.com",
      password: "123abc",
    };

    await api
      .post("/api/user")
      .send(savedUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });
});

// @ts-nocheck
// import request from "supertest";
// import { Response } from "supertest";

// // before all start server and seed db
// // after all close server

// // users can be created
// // post user

// describe("A user can be", () => {
//   test("created", async () => {
//     const newUser = {
//       username: "MyaB",
//       password: "abc123",
//     };

//     const response: Response = await request(app)
//       .post("/users")
//       .send(newUser)
//       .set("Accept", "application/json")
//       .expect("Content-Type", /json/)
//       .expect(200);

//     const usersAtEnd = helper.usersInDB;
//     expect(userAtEnd.length).toStrictEqual(usersAtStart.length + 1);
//   });
// });

// // users can login in
// // post user

// // users can logout
// // put user

// // users can create a setlist
// // post setlist

// // delete setlist

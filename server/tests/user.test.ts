/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { model, Schema } from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  email: string;
  avatar?: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
});

// 3. Create a Model.
const User = model<IUser>("User", userSchema);

// This is an Example test, do not merge it with others and do not delete this file

describe("Single MongoMemoryServer", () => {
  // let con: Mongoose;
  // let mongoServer: MongoMemoryServer;

  // beforeAll(async () => {
  //   mongoServer = await MongoMemoryServer.create();
  //   con = await mongoose.connect(mongoServer.getUri(), {});
  //   console.log(mongoServer.getUri());
  // });

  // afterAll(async () => {
  //   if (con) {
  //     con.disconnect();
  //   }
  //   if (mongoServer) {
  //     await mongoServer.stop();
  //   }
  // });

  it("should successfully set & get information from the database", async () => {
    const user = new User({
      name: "Bill",
      email: "bill@initech.com",
      avatar: "https://i.imgur.com/dM7Thhn.png",
    });
    await user.save();
    console.log(user);
    expect(user.email).toBe("bill@initech.com");
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

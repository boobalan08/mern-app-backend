// const express = require("express"); type:common.js -> old method
import express from "express"; //type:module; -> latest method
import { MongoClient, ObjectId } from "mongodb";
import * as dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import { auth } from "./middleware/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// const MONGO_URL = "mongodb://127.0.0.1";
const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("mongodb is connected");

app.use(express.json());
app.use(cors());

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩 heelo world");
});

app.use("/user", userRouter);

//http://localhost:4000/mobiles

// mobiles -->1. GET
app.get("/mobiles", async (request, response) => {
  const mobiles = await client
    .db("movie")
    .collection("mobiles")
    .find({})
    .toArray();
  response.send(mobiles);
});

// mobiles-->2. POST
app.post("/mobiles", async (request, response) => {
  const data = request.body;
  const result = await client
    .db("movie")
    .collection("mobiles")
    .insertMany(data);
  response.send(result);
});

const ROLE_ID = {
  ADMIN: "0",
  USER: "1",
};
app.delete("/mobiles/:id", auth, async function (request, response) {
  const { id } = request.params;
  const { roleId } = request;

  if (roleId === ROLE_ID.ADMIN) {
    const result = await client
      .db("movie")
      .collection("mobiles")
      .deleteOne({ _id: ObjectId(id) });

    console.log(result);

    result.deletedCount > 0
      ? response.send({ message: "Mobile deleted Successfully" })
      : response.status(401).send({ message: "mobile Not Found" });
  } else {
    response.status(401).send({ message: "Unauthorised" });
  }
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

export { client };

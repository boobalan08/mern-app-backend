import { client } from "../index.js";
import bcrypt from "bcrypt";

export async function generateHashPassword(password) {
  const salt_round = 10;
  const salt = await bcrypt.genSalt(salt_round);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log(salt);
  console.log(hashedPassword);
  return hashedPassword;
}
generateHashPassword("bala@123");

export async function createUser(data) {
  return await client.db("movie").collection("users").insertOne(data);
}
export async function getUserByName(username) {
  return await client
    .db("movie")
    .collection("users")
    .findOne({ username: username });
}

import express from "express";
import {
  generateHashPassword,
  createUser,
  getUserByName,
} from "../services/user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
router.post("/signup", async function (request, response) {
  const { username, password } = request.body;

  const userFromDB = await getUserByName(username);

  console.log(userFromDB);
  if (userFromDB) {
    response.status(400).send({ message: "username already exists" });
  } else if (password.length <= 8) {
    response
      .status(400)
      .send({ message: "password must be alteast 8 characters" });
  } else {
    const hashedPassword = await generateHashPassword(password);
    const result = await createUser({
      username: username,
      password: hashedPassword,
      roleId: "1",
    });
    response.send(result);
  }
});

//! Login user create
router.post("/login", async function (request, response) {
  const { username, password } = request.body;

  const userFromDB = await getUserByName(username);

  console.log(userFromDB);
  if (!userFromDB) {
    response.status(401).send({ message: "Invalid Credential" });
  } else {
    const storedDBPassword = userFromDB.password;
    const isPasswordMatch = await bcrypt.compare(password, storedDBPassword);
    console.log(isPasswordMatch);
    if (isPasswordMatch) {
      const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
      response.send({
        message: "Successful Login",
        token: token,
        roleId: userFromDB.roleId,
      });
    } else {
      response.status(401).send({ message: "Invalid Credential" });
    }
  }
});

export default router;

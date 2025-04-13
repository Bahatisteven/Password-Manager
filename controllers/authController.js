import { createUser, findUserByEmail } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import argon2 from "argon2";
import { validateSignUp } from "../validators/authValidator.js";
import { logger } from "../utils/logger.js";
import { cookieOptions } from "../utils/jwt.js";


const signUp = async (req, res) => {
  try {
    const { error } = validateSignUp(req.body);
    if (error) {
      return res.status(400).json({ messsage: error.details[0].message });
    }

    const {username, email, password} = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({message: "A user with this email already exists."});
    }
    const passwordHash = await argon2.hash(password);
    
    const user = await createUser(username, email, passwordHash);

    const token = generateToken({ id: user.id, email: user.email });
    res.cookie("token", token, cookieOptions);

    const { password_hash, ...safeUser } = user;
    logger.info(`User ${email} signed up successfully.`);
    res.status(201).json({ user: safeUser });
  } catch (error) {
    logger.error("Error during signup:", error);
    res.status(500).json({message: "An error occurred during signup."})
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials."});
    }
    const isPasswordValid = await argon2.verify(user.password_hash, password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = generateToken({ id: user.id, email: user.email });
    res.cookie("token", token, cookieOptions);

    const { password_hash, ...safeUser } = user;
    logger.info(`User ${email} logged in successfully.`);
    res.status(200).json({ user: safeUser });
  } catch(error) {
    logger.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};


export { signUp, login };

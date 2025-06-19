import bcrypt from "bcryptjs";
import User from "../models/user.js";
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      isMfaActive: false,
    });
    //saving this new user
    await newUser.save();
    //need to send res back to the user
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user", message: error });
  }
};
export const login = async (req, res) => {
  console.log("The authenticated user is :", req.user);
  res.status(200).json({
    message: "User logged in successfully",
    username: req.user.username,
    isMfaActive: req.user.isMfaActive,
  });
};
export const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User logged in successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(401).json({ message: "Unauthorized User" });
  }
};
export const logout = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  req.logout((err) => {
    if (err) {
      return res.status(400).json({ message: "Logout failed", error: err });
    }

    // Destroy the session completely (optional but safer)
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res
          .status(500)
          .json({ message: "Failed to destroy session", error: sessionErr });
      }

      res.clearCookie("connect.sid"); // Assuming default cookie name
      res.status(200).json({ message: "User logged out successfully" });
    });
  });
};

export const verify2FA = async () => {};
export const reset2FA = async () => {};
export const setup2FA = async () => {};

import bcrypt from "bcryptjs";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";
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
      message: "User authentication successfull",
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

export const verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = req.user;
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });
  //if the user is 2fa then only providing the jwt token for further api access
  if (verified) {
    const jwtToken = jwt.sign(
      { username: user.username.User },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );
    res.status(200).json({
      message: "2fa successfull",
      token: jwtToken,
    });
  } else {
    res.status(400).json({ message: "Invalid 2fa token" });
  }
};
export const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.twoFactorSecret = "";
    user.isMfaActive = false;
    await user.save();
    res.status(200).json({ message: "2fa reset successfull" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const setup2FA = async (req, res) => {
  try {
    const user = req.user;
    let secret = speakeasy.generateSecret();
    console.log("value of the secret object ", secret);

    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    user.save();
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "www.bhattacharjeeSatyaki.com",
      encoding: "base32",
    });
    const qrImageUrl = await qrCode.toDataURL(url);
    res.status(200).json({
      qrCode: qrImageUrl,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error setting up 2fa" });
  }
};

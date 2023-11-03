const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');


const register = async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    phone_number,
    address,
    city,
    age,
    gender,
    country,
  } = req.body;

  try {
    // Check if email already exists
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError("Email already exists");
    }

    // Check if the email contains "ad" to identify an admin
    const isAdmin = email.includes("ad");

    // Create a new user with the provided fields
    const newUser = await User.create({
      email,
      password,
      first_name,
      last_name,
      phone_number,
      address,
      city,
      age,
      gender,
      country,
      // Add a role field based on whether it's an admin or not
      role: isAdmin ? "admin" : "user",
    });

    // Additional validation can be added here if necessary

    const userWithToken = createTokenUser(newUser);
    attachCookiesToResponse({ res, user: userWithToken });

    res.status(StatusCodes.CREATED).json({ user: userWithToken });
  } catch (error) {
    // Handle validation errors or other errors and send an appropriate response
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      res.status(StatusCodes.BAD_REQUEST).json({ error: errors });
    } else {
      // Handle other types of errors
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const login = async (req, res) => {
  // const { data } = req.body;
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    token = res.getHeaders()["set-cookie"];
    res.status(StatusCodes.CREATED).json({ user: tokenUser, token: token });
  } catch (error) {
    // Handle other errors here, if needed
    return res.status(500).json({ error: "An error occurred" });
  }
};
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

module.exports = {
  register,
  login,
  logout,
};

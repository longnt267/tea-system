const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Validate name
//     if (!validator.isLength(name, { min: 3, max: 50 })) {
//       return res
//         .status(400)
//         .json({ message: "Name must be between 3 and 50 characters" });
//     }

//     // Validate email
//     if (
//       !validator.isEmail(email) ||
//       !validator.isLength(email, { min: 3, max: 255 })
//     ) {
//       return res.status(400).json({ message: "Invalid email address" });
//     }

//     // Validate password
//     if (!validator.isStrongPassword(password)) {
//       return res.status(400).json({
//         message:
//           "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     const newUser = new UserModel({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     // Save user to database
//     await newUser.save();

//     // Generate JWT token
//     const token = createToken(newUser._id);

//     // Return user info and token
//     res.status(201).json({
//       message: "User registered successfully",
//       id: newUser._id,
//       name: newUser.name,
//       email: newUser.email,
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if email and password are provided
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Please provide email and password" });
//     }

//     // Find user by email
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Check if password is correct
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Generate JWT token
//     const token = createToken(user._id);

//     // Return user info and token
//     res.status(200).json({
//       message: "Login successful",
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const findUser = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     const user = await UserModel.findById(userId).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "User found successfully",
//       id: user._id,
//       name: user.name,
//       email: user.email,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const getAllUsers = async (req, res) => {
//   try {
//     const users = await UserModel.find().select("-password");

//     if (!users || users.length === 0) {
//       return res.status(404).json({ message: "No users found" });
//     }

//     const formattedUsers = users.map((user) => ({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//     }));

//     res.status(200).json({
//       message: "Users retrieved successfully",
//       users: formattedUsers,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// module.exports = {};

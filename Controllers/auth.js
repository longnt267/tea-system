import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Prize } from "../models/prize.js";
import { ERoles, JWT_SECRET } from "../constants/index.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

cloudinary.config({
  cloud_name: "dahdim8zk",
  api_key: "346556622422922",
  api_secret: "ROtxHJ1Hq-RLHZfq2oztM7MsLu8",
});

// Cấu hình multer để lưu file vào bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, ...args } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email and password" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: ERoles.USER,
      ...args,
    });

    // Generate token
    const token = createToken(user.id);

    res.status(201).json({
      message: "Registration successful",
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email using Mongoose
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = createToken(user.id);
    delete user.password;
    // Return user info and token
    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const savePrize = async (req, res) => {
  try {
    // Sử dụng multer để xử lý upload file ảnh
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: 'Lỗi tải lên ảnh' });
      }
      
      // Lấy thông tin prizeName và file từ request body
      const prizeName = req.body.prizeName;
      const file = req.file; // Chú ý dùng `req.file` thay vì `req.body.file` vì multer sẽ lưu file vào `req.file`

      if (!file) {
        return res.status(400).json({ success: false, message: 'Ảnh không được tìm thấy' });
      }

      // Upload ảnh lên Cloudinary
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Tự động nhận dạng loại file (image, video, etc.)
          public_id: `prizes/${Date.now()}_${file.originalname}`, // Tạo public_id cho file upload
        },
        async (error, cloudinaryResponse) => {
          if (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi tải ảnh lên Cloudinary' });
          }

          // Lưu thông tin phần thưởng vào cơ sở dữ liệu
          const prizeData = {
            prize: prizeName, // Lưu tên phần thưởng vào trường prize
            url: cloudinaryResponse.secure_url, // Lưu URL ảnh từ Cloudinary vào trường url
          };

          // Lưu thông tin vào model Prize (sử dụng mongoose)
          const prize = await Prize.create(prizeData);

          // Trả về thông tin phần thưởng đã lưu
          res.status(201).json({
            success: true,
            message: 'Lưu phần thưởng thành công',
            prize,
          });
        }
      ).end(file.buffer); // Truyền buffer của file vào stream
    });
  } catch (error) {
    console.error('Lỗi khi lưu phần thưởng:', error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra' });
  }
};

export { loginUser, registerUser, savePrize };

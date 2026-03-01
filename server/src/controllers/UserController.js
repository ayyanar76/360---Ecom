// import dotenv from 'dotenv'
// dotenv.config()
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import Order from "../models/OrderItemSchema.js";

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        msg: "Fields Required",
      });
    }
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(409).json({
        success: false,
        msg: "User already exists",
      });
    }

    const HashPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: HashPassword,
    });
    res.status(201).json({
      success: true,
      msg: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Fields Required",
      });
    }
    const existsUser = await User.findOne({ email }).select("+password");
    if (!existsUser) {
      return res.status(404).json({
        success: false,
        msg: "User Not Found",
      });
    }
    const isMatching = await bcrypt.compare(password, existsUser.password);
    if (!isMatching) {
      return res.status(401).json({
        success: false,
        msg: "Email or Password Is Invalid",
      });
    }
    const token = jwt.sign({ id:existsUser._id }, process.env.JWT_SECRET, {
      expiresIn:process.env.JWT_EXPIRE,
    });
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.json({
        success:true,
        msg:"Logged In"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};  

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({
      success: true,
      msg: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};


export const getMe = async (req,res) => {
    try {
      const getMe = await User.findById(req.userId).select("-password")
      const product =  await Order.find({ user: req.userId })
      .sort({ createdAt: -1 });
      res.json({
        success: true,
        getMe,
        product
      })
    } catch (error) {
       res.status(500).json({
        success:false,
       msg:error.message
       })
    }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const allowed = ["User", "admin"];

    if (!allowed.includes(role)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true })
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";

export const UserAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Token Missing Login Again",
      });
    }
    const decode = jwt.verify(token,process.env.JWT_SECRET)
    if(!decode){
      return res.status(401).json({
        success: false,
        msg: "Invalid",
      });
    }
    req.userId = decode.id
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      msg: error.message,
    });
  }
};

export const RoleAuth = ([...roles]) => {

 return  async (req, res, next) => {
     const user = await User.findById(req.userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }    
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Not authorized.",
        });
      }
      next();
  };
};

    //  import jwt from 'jsonwebtoken';

    // const authMiddleware = (req, res, next) => {
    //     console.log("req.header('Authorization')",req.header('Authorization'))
        
    //     const token = req.header('Authorization')?.replace('Bearer ', '');
    //     if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    //     try {
    //         const decoded = jwt.verify(token, 'abcc');
    //         req.user = decoded;
    //         next();
    //     } catch (error) {
    //         res.status(401).json({ message: 'Token is not valid' });
    //     }
    // };

    //  export default authMiddleware


     // in this file only token verfit and send that into req.user

     //but in this another code frist check token and get id from that token 
    //  and  get all based on id and send that into req.user


    import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token failed" });
  }
};

export const roleCheck = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
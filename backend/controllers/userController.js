import User from "../models/User.js";
import  upload  from "../middlewares/upload.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { skills } = req.body;
  const update = { skills };
  if (req.file) update.resume = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select(
    "-password"
  );
  res.json(user);
};
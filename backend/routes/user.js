import { Router } from "express";
import { protect, roleCheck } from "../middlewares/auth.js";
import { getProfile, updateProfile } from "../controllers/userController.js";
import   upload   from "../middlewares/upload.js";

const router = Router();

router.use(protect);
router.get("/profile", getProfile);
router.put("/profile", roleCheck("seeker"), upload.single("resume"), updateProfile);

export default router;
import { Router } from "express";
import { protect, roleCheck } from "../middlewares/auth.js";
import {
  createJob,
  getAllJobs,
  getMyJobs,
  applyJob,
  getApplicants,
  getMyApplications
} from "../controllers/jobController.js";
import { jobValidator } from "../utils/validators.js";

const router = Router();

router.get("/", getAllJobs); // public
router.use(protect);

router.post("/", roleCheck("employer"), jobValidator, createJob);
router.get("/my", roleCheck("employer"), getMyJobs);
router.post("/:jobId/apply", roleCheck("seeker"), applyJob);
router.get("/:jobId/applicants", roleCheck("employer"), getApplicants);
router.get("/my-applications", protect, roleCheck("seeker"), getMyApplications);

export default router;
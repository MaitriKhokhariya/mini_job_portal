import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const createJob = async (req, res) => {
  const { title, description, location, skills } = req.body;
  const job = await Job.create({
    title,
    description,
    location,
    skills,
    employer: req.user._id,
  });
  res.status(201).json(job);
};

export const getAllJobs = async (req, res) => {
  const { search, location, skill } = req.query;
  const query = {};

  if (search) query.$or = [{ title: new RegExp(search, "i") }, { description: new RegExp(search, "i") }];
  if (location) query.location = new RegExp(location, "i");
  if (skill) query.skills = skill;

  const jobs = await Job.find(query).populate("employer", "name email");
  res.json(jobs);
};

export const getMyJobs = async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id });
  res.json(jobs);
};

export const applyJob = async (req, res) => {
  const { jobId } = req.params;
  const existed = await Application.findOne({ job: jobId, seeker: req.user._id });
  if (existed) return res.status(400).json({ message: "Already applied" });

  const application = await Application.create({ job: jobId, seeker: req.user._id });
  res.status(201).json(application);
};

export const getApplicants = async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);
  if (!job || job.employer.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Forbidden" });

  const applicants = await Application.find({ job: jobId })
    .populate("seeker", "name email skills resume")
    .sort({ appliedAt: -1 });
  res.json(applicants);
};


export const getMyApplications = async (req, res) => {
  const apps = await Application.find({ seeker: req.user._id })
    .populate({
      path: "job",
      populate: { path: "employer", select: "name email" },
    })
    .sort({ appliedAt: -1 });

  res.json(apps);
};
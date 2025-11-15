import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import jobRouter from "./routes/job.js";
// import "express-async-errors";
import "dotenv/config";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/jobs", jobRouter);

app.get("/", (req, res) => res.send("Job Portal API"));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
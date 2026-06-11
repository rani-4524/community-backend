import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import communityRoutes from "./routes/communityRoute.js";
import eventRoutes from "./routes/eventRoute.js";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://communityhub-live.vercel.app",
      "https://community-frontend-ffcq8agff-rani-4524s-projects.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/profile_pictures", express.static(path.resolve("profile_pictures")));

app.use("/api/user", userRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/event", eventRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

connectDb(MONGO_URL);

app.get("/", (req, res) => {
  res.send("app");
});

app.listen(PORT, () => {
  console.log(`server is running on address http://localhost:${PORT}`);
});

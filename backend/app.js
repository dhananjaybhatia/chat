import dotenv from "dotenv";
import express from "express";
import databaseConnect from "./DB/databaseConnect.js";
import userRoute from "./Routes/userRoute.js";
import messageRoute from "./Routes/messageRoute.js";
import userFuncRoute from "./Routes/userFuncRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", userRoute);
app.use("/api/message", messageRoute);
app.use("/api/user", userFuncRoute);

app.listen(PORT, () => {
  databaseConnect();
  console.log(`Server is running on port ${PORT}`);
});

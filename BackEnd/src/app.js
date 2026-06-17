import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

// app initialisation
const app = express();


// middlewares
app.use(cors()); // Search more about cors when revisit this 
app.use(express.json());
app.use(cookieParser());





// Routes
app.use("/api/auth", authRoutes);





app.get("/", (req, res) => {
    res.send("Track Academy Backend Running 🚀");
});






export default app;
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

// app initialisation
const app = express();




// middlewares
app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    credentials: true
})); // search more about cors when u revisit it 

app.use(express.json());
app.use(cookieParser());





// Routes
app.use("/api/auth", authRoutes);





app.get("/", (req, res) => {
    res.send("Track Academy Backend Running 🚀");
});






export default app;
 

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const app = express();
connectDB();

app.use(cors({
  origin: "*",  
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true,
  optionsSuccessStatus: 204,
}));


app.use(express.json({ limit: "1mb" }));

// Debug logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

app.use(ClerkExpressWithAuth({ secretKey: process.env.CLERK_SECRET_KEY }));
app.use((req, res, next) => {
  console.log("Auth:", req.auth);
  next();
});

// Debug route
app.post("/api/test", (req, res) => {
  res.json({ received: req.body });
});

//   Main Routes
const userRoutes = require("./routes/userRoute");
const sessionRoutes = require("./routes/sessionRoute");
const questionRoutes = require("./routes/quesRoute");
const aiRoutes = require("./routes/aiRoute");  

app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/ai", aiRoutes);  

// Root
app.get("/", (req, res) => {
  res.send("PrepXpert Backend is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

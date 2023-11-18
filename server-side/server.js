const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser')
const cors = require('cors');
const crypto=require('crypto');
const connectDB = require("./config/db");
const path = require("path");
//dot config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();
app.use(cookieParser());
//middlewares
app.use(express.json());
// Middleware for general CORS options
app.use(cors());

// Middleware with specific origin and credentials
app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }));


//routes
// 1 test route
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));


app.use(express.static(path.join(__dirname,'../frontend/dist')))


const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(
    `Node Server Running On Port ${process.env.PORT}`
  );
});

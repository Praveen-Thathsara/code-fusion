import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import giftVoucherRoutes from "./routes/giftVoucherRoutes.js";

import auth from "./middleware/auth.js";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

console.log(process.env.NODE_ENV);

app.use("/api/auth", authRoutes);
app.use("/api/user", auth, userRoutes);
app.use("/api/movie", auth, movieRoutes);
app.use("/api/rental", auth, rentalRoutes);
app.use("/api/genre", auth, genreRoutes);
app.use("/api/feedback", auth, feedbackRoutes);
app.use("/api/gift-voucher", auth, giftVoucherRoutes);

const port = process.env.PORT || 3001;

const server =
  process.env.NODE_ENV === "test"
    ? app.listen(0, () => {
        console.log(`server is running on port ${server.address().port}`);
      })
    : app.listen(port, () => {
        console.log(`server is running on port ${port}`);
      });

export default server;
// server.js

const express = require('express');
const bodyParser = require('body-parser');
const movieRoutes = require('./routes/movieRoutes');

app.use(bodyParser.json()); // For parsing JSON request bodies

// Use movie routes
app.use('/api/movie', movieRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

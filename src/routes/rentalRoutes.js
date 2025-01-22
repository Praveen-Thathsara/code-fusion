import express from "express";
import movieController from "../controller/rentalController.js";

const {
  addRental,
  getRentals,
  getRentalByMovieId,
  getRentalByUserId,
  deleteRental,
  getLastRentalStatus,
  giftRental,
} = movieController;

const router = express.Router();

router.post("/", addRental);
router.post("/gift", giftRental);
router.get("/", getRentals);
router.get("/user", getRentalByUserId);
router.get("/status/:id", getLastRentalStatus);
router.get("/movie/:id", getRentalByMovieId);
router.delete("/:id", deleteRental);

export default router;

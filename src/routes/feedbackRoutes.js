import express from "express";
import feedbackController from "../controller/feedbackController.js";

const {
  addFeedback,
  getSingleFeedback,
  getAllFeedbackForMovie,
  getTopBottomFeedbacksForMovie,
  updateFeedback,
  sortFeedback,
  deleteFeedback,
} = feedbackController;

const router = express.Router();

router.post("/", addFeedback);
router.put("/:movieId", updateFeedback);
router.get("/movie/sort/:movieId", sortFeedback);
router.get("/movie/topBottom/:movieId", getTopBottomFeedbacksForMovie);
router.get("/:movieId", getSingleFeedback);
router.get("/search/:movieId", getAllFeedbackForMovie);
router.delete("/:movieId/:userId", deleteFeedback);

export default router;

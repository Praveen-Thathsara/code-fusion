import express from "express";
import movieController from "../controller/movieController.js";
import admin from "../middleware/admin.js";
import paginationMiddleware from "../middleware/pagination.js";

const {
  addMovie,
  addNextBestMovie,
  getMovieById,
  getMovies,
  deleteMovie,
  getMovieSuggestions,
  getTopThreeMovies,
  getMoviesWithPagination,
  getUpcomingMovies,
  getSimilarMovies,
  searchMovies,
  getLeastRentedMovies,
  updateMovie,
  getBestRevenuedMovies,
} = movieController;

const router = express.Router();

router.post("/", admin, addMovie);
router.post("/bestRevenued", admin, addNextBestMovie);
router.get("/bestRevenued", getBestRevenuedMovies);
router.delete("/:id", admin, deleteMovie);
router.get("/", getMovies);
router.get("/upcoming", getUpcomingMovies);
router.get("/top-three", getTopThreeMovies);
router.get("/pagination", paginationMiddleware(), getMoviesWithPagination);
router.get("/suggestions", getMovieSuggestions);
router.get("/least-rented", getLeastRentedMovies);
router.get("/search/movies", paginationMiddleware(), searchMovies);
router.get("/:id/similar", getSimilarMovies);
router.get("/:id", getMovieById);
router.put("/:id", updateMovie);

export default router;

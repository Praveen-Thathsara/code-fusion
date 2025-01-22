import express from "express";
import genreController from "../controller/genreController.js";
import admin from "../middleware/admin.js";

const { addGenre, getAllGenres, getGenreById, updateGenre, deleteGenre } =
  genreController;

const router = express.Router();

router.post("/", admin, addGenre);
router.get("/", getAllGenres);
router.get("/:id", getGenreById);
router.put("/:id", admin, updateGenre);
router.delete("/:id", admin, deleteGenre);

export default router;

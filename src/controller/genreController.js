import { v4 as uuidv4 } from "uuid";
import genreRepository from "../repositories/genreRepository.js";
import HttpStatus from "../enums/httpStatus.js";
import Genre from "../models/genre.js";

const genre = new Genre(null, null);

const addGenre = async (req, res) => {
  try {
    const { name } = req.body;
    genre.id = uuidv4();
    genre.name = name;
    const result = genre.validate();
    if (result.error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(result.error.details[0].message);

    const isExistingGenre = await genreRepository.getGenreByName(name);

    const newGenre = await genreRepository.addGenre(genre);
    if (!newGenre) {
      throw new Error();
    }
    return res.status(HttpStatus.CREATED).json({ data: newGenre });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};

const getGenreById = async (req, res) => {
  try {
    const id = req.params.id;
    genre.id = id;
    const validateErrMsg = genre.validateId();
    if (validateErrMsg)
      return res.status(HttpStatus.BAD_REQUEST).send(validateErrMsg);

    const result = await genreRepository.getGenreById(id);
    if (!result) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Genre not found" });
    }

    return res.status(HttpStatus.OK).json({ data: result });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};

const getAllGenres = async (req, res) => {
  try {
    const genres = await genreRepository.getAllGenres();

    if (!genres) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Genres not found" });
    }

    return res.status(HttpStatus.OK).json({ data: genres });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};

const updateGenre = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    genre.id = id;
    genre.name = name;
    const result = genre.validateUpdate();
    if (result.error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(result.error.details[0].message);

    const updatedGenre = await genreRepository.updateGenre(genre);

    if (!updatedGenre) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Genre not found" });
    }

    return res.status(HttpStatus.OK).json({ data: updatedGenre });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};

const deleteGenre = async (req, res) => {
  try {
    console.log("from delete controller");
    const id = req.params.id;
    genre.id = id;

    // Validate the genre ID
    const validateErrMsg = genre.validateId();
    if (validateErrMsg) {
      return res.status(HttpStatus.BAD_REQUEST).send(validateErrMsg);
    }

    // Attempt to delete the genre
    const result = await genreRepository.deleteGenre(id);

    // Check if the genre was found and deleted
    if (result === 0) { // Assuming result is the number of affected rows
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Genre not found" });
    }

    return res.status(HttpStatus.OK).json({ message: "Genre deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred" });
  }
};



export default {
  addGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
  deleteGenre,
};

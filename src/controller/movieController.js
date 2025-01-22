import Movie from "../models/movie.js";
import HttpStatus from "../enums/httpStatus.js";
import { v4 as uuidv4 } from "uuid";
import genreRepository from "../repositories/genreRepository.js";
import movieRepository from "../repositories/movieRepository.js";
import rentalRepository from "../repositories/rentalRepository.js";

const addMovie = async (req, res) => {
  try {
    const {
      title,
      year,
      dailyRentalRate,
      genres,
      imdbRating,
      posterUrl,
      bannerUrl,
      plot,
      runtime,
      directedBy,
      starring,
      releaseAt,
    } = req.body;

    movie.id = uuidv4();
    movie.title = title;
    movie.year = year;
    movie.dailyRentalRate = dailyRentalRate;
    movie.discountRate = 0;
    movie.genres = genres;
    movie.imdbRating = imdbRating;
    movie.posterUrl = posterUrl;
    movie.bannerUrl = bannerUrl;
    movie.plot = plot;
    movie.runtime = runtime;
    movie.directedBy = directedBy;
    movie.starring = starring;
    movie.releaseAt = releaseAt;
    movie.isDeleted = false;

    const resultValidation = movie.validate();
    if (resultValidation.error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(resultValidation.error.details[0].message);

    const result = await movieRepository.addMovie(movie);

    if (!result) {
      throw error;
    }

    return res.status(HttpStatus.CREATED).json({ data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};

const addNextBestMovie = async (req, res) => {
  console.log("Received request to add next best movie");
  const { nextMovies } = req.body;
  let bestSimilarityFraction = 0;
  let nextBestMovie = null;
  try {
    const bestMovies = await getBestRevenuedMovies();
    console.log("Best Movies:", bestMovies);
    for (const nextMovie of nextMovies) {
      const currentSimilarityFraction = bestMovies.reduce(
        (similarityFraction, currentMovie, index) =>
          (similarityFraction +
            getJaccardSimilarityIndex(nextMovie, currentMovie)) /
          (index + 1),
        0
      );
      if (currentSimilarityFraction > bestSimilarityFraction) {
        bestSimilarityFraction = currentSimilarityFraction;
        nextBestMovie = nextMovie;
      }
    }

    const {
      id,
      title,
      year,
      dailyRentalRate,
      discountRate,
      genres,
      imdbRating,
      posterUrl,
      bannerUrl,
      plot,
      runtime,
      directedBy,
      starring,
      releaseAt,
      isDeleted,
      
    } = nextMoviesData;

    movie.id = uuidv4();
    movie.title = title;
    movie.year = year;
    movie.dailyRentalRate = dailyRentalRate;
    movie.discountRate = 0;
    movie.genres = genres;
    movie.imdbRating = imdbRating;
    movie.posterUrl = posterUrl;
    movie.bannerUrl = bannerUrl;
    movie.plot = plot;
    movie.runtime = runtime;
    movie.directedBy = directedBy;
    movie.starring = starring;
    movie.releaseAt = releaseAt;
    movie.isDeleted = false;

    const resultValidation = movie.validate();
    if (resultValidation.error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(resultValidation.error.details[0].message);

    const existingMovie = await movieRepository.getMovieByNameAndYear(
      title,
      year
    );

    if (existingMovie) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Movie already exists" });
    }

    const result = await movieRepository.addMovie(movie);

    if (!result) {
      throw error;
    }

    return res.status(HttpStatus.CREATED).json({ data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};

const getMovieById = async (req, res) => {
  try {
    const id = req.params.id;
    movie.id = id;
    const validateErrMsg = movie.validateId();
    if (validateErrMsg)
      return res.status(HttpStatus.BAD_REQUEST).send(validateErrMsg);
    const result = await movieRepository.getMovieById(id);

    if (result == null) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Movie not found" });
    } else if (result.isDeleted) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Movie not found" });
    }

    return res.status(HttpStatus.OK).json({ data: result });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

const getMovies = async (req, res) => {
  try {
    let movies = await movieRepository.getMovies();
    //challenge 4.b remove this code
    //upto here
    return res.status(HttpStatus.OK).json({ data: movies });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};


//Implement challenge 3.b here
const updateDailyRentalRateMovie = async (req, res) => {};

//challenge 12.b starts here
const getBestRevenuedMovies = async (req, res) => {
  let bestRevenuedMovies = [];
  try {
    // const allMovies = await movieRepository.getMovies();
    // if (allMovies?.length) {
    //   for (const movie of allMovies) {
    //     let movieIncome = 0;
    //     const movieRentals = await rentalRepository.getRentalByMovieId(
    //       movie.id
    //     );
    //     if (movieRentals != null) {
    //       movieRentals.forEach((rental) => {
    //         movieIncome += rental.rentalFee;
    //       });
    //     }
    //   }
    //   return res.status(HttpStatus.OK).json({ bestRevenuedMovies });
    // } else return null;
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

//challenge 12.b ends here
const getAvgIncomePerMovie = async () => {
  // console.log("Received request to get average income per movie");
  try {

  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

const calculateIncomeLessThanAvg = async (movieId) => {
  let isRentedThisMonth = false;
  let isIncomeLessThanAverage = false;
  let movieIncome = 0;
  try {
    const averageIncomePerMovie = await getAvgIncomePerMovie();
    const movieRentals = await rentalRepository.getRentalByMovieId(movieId);
    // if (movieRentals != null) {
    //   movieRentals.forEach((rental) => {
    //     const rentedAt = new Date(rental.rentedAt);
    //     const currentMonth = new Date().getMonth();
    //     if (rentedAt.getMonth() === currentMonth) {
    //       isRentedThisMonth = true;
    //     }
    //     movieIncome += rental.rentalFee;
    //   });
    // }

    if (movieIncome < averageIncomePerMovie) {
      isIncomeLessThanAverage = true;
    }
    return {
      isIncomeLessThanAverage,
      isRentedThisMonth,
    };
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

const deleteMovie = async (req, res) => {
  try {
    const id = req.params.id;
    movie.id = id;

    const validateErrMsg = movie.validateId();
    if (validateErrMsg)
      return res.status(HttpStatus.BAD_REQUEST).send(validateErrMsg);

    const { isIncomeLessThanAverage, isRentedThisMonth } =
      await calculateIncomeLessThanAvg(id);
    if (!isRentedThisMonth && isIncomeLessThanAverage) {
      const result = await movieRepository.deleteMovie(id);
      if (result === "SQL Error") {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send("An error occurred");
      } else {
        return res.status(HttpStatus.OK).json({ data: result });
      }
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send("Movie cannot be deleted");
    }
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

const getMovieSuggestions = async (req, res) => {
  // try {
  //   const id = req.user.id;
  //   movie.id = id;
  //   const validateErrMsg = movie.validateId();
  //   if (validateErrMsg)
  //     return res.status(HttpStatus.BAD_REQUEST).send(validateErrMsg);
  //   const result = await movieRepository.getMovieSuggestions(id);
  //   if (result.length == 0) {
  //     return res.status(HttpStatus.NOT_FOUND).send("Movies not found");
  //   } else {
  //     return res.status(HttpStatus.OK).json({ data: result });
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return res
  //     .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //     .send("An error occurred");
  // }
};

const getTopThreeMovies = async (req, res) => {
  try {
    const movies = await movieRepository.getTopThreeMovies();
    if (movies.length == 0) {
      return res.status(HttpStatus.NOT_FOUND).send("Movies not found");
    }
    return res.status(HttpStatus.OK).json({ data: movies });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

const getMoviesWithPagination = async (req, res) => {
  // const { page, limit } = req.pagination;
  // try {
  //   let movies = await movieRepository.getMoviesWithPagination(page, limit);
  //   if (movies.length == 0) {
  //     return res.status(HttpStatus.NOT_FOUND).send("Movies not found");
  //   }
  //   return res.status(HttpStatus.OK).json({ data: movies });
  // } catch (error) {
  //   console.log(error);
  //   return res
  //     .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //     .send("An error occurred");
  // }
};

//challenge 12 starts here
const getUpcomingMovies = async (req, res) => {
  //remove following part
  try {
    const movies = await movieRepository.getMovies();
    const upComingMovies = movies.filter((movie) => {
      const releaseAtISO = new Date(movie.releaseAt);
      return releaseAtISO.getTime() > Date.now() && !movie.isDeleted;
    });
    if (upComingMovies.length == 0) {
      return res.status(HttpStatus.NOT_FOUND).send("Upcoming Movies not found");
    }
    return res.status(HttpStatus.OK).json({ data: upComingMovies });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
  //add following part
  /*try{
  const movies = await movieRepository.getMovies();
  return res.status(HttpStatus.OK).json({ data: movies });
} catch (error) {
 console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }*/
};
//challenge 12 ends here

//challenge 10 begins here
const getJaccardSimilarityIndex = (movie1, movie2) => {
  const movieSet1 = new Set([
    ...movie1.genres,
    ...movie1.directedBy.split(","),
    ...movie1.starring.split(","),
  ]);
  const movieSet2 = new Set([
    ...movie2.genres,
    ...movie2.directedBy.split(","),
    ...movie2.starring.split(","),
  ]);

  const intersectionSet = new Set(
    [...movieSet1].filter((x) => movieSet2.has(x))
  );

  const unionSet = new Set([...movieSet1, ...movieSet2]);

  return intersectionSet.size / unionSet.size;
};

const getMovieGenreVector = async (movieId, genreNames) => {
  const movie = await movieRepository.getMovieById(movieId);

  const genresList = genreNames.map((genre) => {
    let boolean = 0;
    if (movie.genres.includes(genre)) {
      boolean = 1;
    }
    return boolean;
  });

  return genresList;
};

const getCosineSimilarityIndex = (movie1, movie2) => {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < movie1.length; i++) {
    dotProduct += movie1[i] * movie2[i];
    magnitude1 += Math.pow(movie1[i], 2);
    magnitude2 += Math.pow(movie2[i], 2);
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  const cosineSimilarity = dotProduct / (magnitude1 * magnitude2);
  return cosineSimilarity;
};

const getSimilarMovies = async (req, res) => {
  const { id } = req.params;
  const { method } = req.query;

  let movies = await movieRepository.getMovies();
  movies = movies.filter((movie) => !movie.isDeleted);
  const otherMovies = movies.filter((movie) => movie.id !== id);

  let similarMovies = [];

  if (method === "jaccard") {
    const currentMovie = movies.find((movie) => movie.id === id);

    similarMovies = otherMovies.map((movie) => {
      const jaccardSimilarityIndex = getJaccardSimilarityIndex(
        currentMovie,
        movie
      );
      movie.similarityIndex = jaccardSimilarityIndex;
      return movie;
    });
  } else if (method === "cosine") {
    const genres = await genreRepository.getAllGenres();
    const genreNames = genres.map((genre) => genre.name);

    const currentMovieGenreVector = await getMovieGenreVector(
      id,
      genreNames
    );

    for (let otherMovie of otherMovies) {
      const otherMovieGenreVector = await getMovieGenreVector(
        otherMovie.id,
        genreNames
      );
      otherMovie.similarityIndex = getCosineSimilarityIndex(
        currentMovieGenreVector,
        otherMovieGenreVector
      );
    }

    similarMovies = otherMovies;
  } else {
    return res.status(HttpStatus.BAD_REQUEST).send("Invalid method");
  }

  const sortedSimilarMovies = similarMovies.sort((a, b) => {
    if (a.similarityIndex === b.similarityIndex) {
      return a.title.localeCompare(b.title);
    }
    return b.similarityIndex - a.similarityIndex;
  });

  return res.status(HttpStatus.OK).json({ data: sortedSimilarMovies });
};
//challenge 10 ends here

const searchMovies = async (req, res) => {
  const { page, limit } = req.pagination;
  try {
    const keyword = req.query.keyword;
    const movies = await movieRepository.searchMovies(keyword, limit, page);
    if (movies.length == 0) {
      return res.status(HttpStatus.NOT_FOUND).send("Movies not found");
    } else if (movies.isDeleted) {
      return res.status(HttpStatus.NOT_FOUND).send("Movies not found");
    }
    return res.status(HttpStatus.OK).json({ data: movies });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

//challenge 9 starts here
const getLeastRentedMovies = async (req, res) => {
  try {
    let movies = await movieRepository.getLeastRentedMovies();
    if (movies.length == 0) {
      return res.status(HttpStatus.NOT_FOUND).send("Movies not found");
    }
    return res.status(HttpStatus.OK).json({ data: movies });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};
//challenge 9 ends here


// Function to update movie details

export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  console.log("Received update request for movie ID:", req.params.id);
  

  try {
    
    const movie = await movieRepository.updateMovie(id, updatedData);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie); // Send back the updated movie
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export default {
  addMovie,
  addNextBestMovie,
  getMovieById,
  getMovies,
  // updateDailyRentalRateMovie,
  deleteMovie,
  getMovieSuggestions,
  getTopThreeMovies,
  getMoviesWithPagination,
  getUpcomingMovies,
  getSimilarMovies,
  searchMovies,
  getLeastRentedMovies,
  updateMovie,
  getBestRevenuedMovies
};
// movieController.js

const movieRepository = require('../repositories/movieRepository');

async function addMovie(req, res) {
  const { title, year, dailyRentalRate, genres, imdbRating, posterUrl, bannerUrl, plot, runtime, directedBy, starring, releaseAt } = req.body;

  try {
    // Check if movie already exists
    const movieExists = await movieRepository.getMovieByNameAndYear(title, year);
    if (movieExists) {
      return res.status(400).json({ message: 'Movie already exists.' });
    }

    // Add new movie if it doesn't exist
    const movieData = {
      title,
      year,
      dailyRentalRate,
      genres,
      imdbRating,
      posterUrl,
      bannerUrl,
      plot,
      runtime,
      directedBy,
      starring,
      releaseAt,
    };

    const newMovie = await movieRepository.addMovie(movieData);
    return res.status(201).json(newMovie);
  } catch (error) {
    console.error('Error adding movie:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  addMovie,
};

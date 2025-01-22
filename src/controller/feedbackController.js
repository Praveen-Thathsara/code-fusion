import Feedback from "../models/feedback.js";
import HttpStatus from "../enums/httpStatus.js";
import feedbackRepository from "../repositories/feedbackRepository.js";
import userRepository from "../repositories/userRepository.js";
import movieRepository from "../repositories/movieRepository.js";

const milisecondsInADay = 86400000;

const feedback = new Feedback(null, null, null, null);

const addFeedback = async (req, res) => {
  // const { movieId, rating, comment=null } = req.body;
  // feedback.userId = req.user.id;
  // feedback.movieId = movieId;
  // feedback.rating = rating;
  // feedback.comment = comment;
  // feedback.createdAt = new Date().toISOString();
  // const result = feedback.validate();
  // if (result.error)
  //   return res
  //     .status(HttpStatus.BAD_REQUEST)
  //     .send(result.error.details[0].message);
  // try {
  //   const feedbackExists = await feedbackRepository.getSingleFeedback(
  //     feedback.userId,
  //     feedback.movieId
  //   );

  //   let result = null;
    //challenge 8.b remove following code
   
    //until here
    // return res.status(HttpStatus.OK).json({ data: result});

  // } catch (error) {
  //   return res
  //     .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //     .json({ message: "An error occurred" });
  // }
};

const getSingleFeedback = async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;
  feedback.userId = userId;
  feedback.movieId = movieId;
  const result = feedback.validateGetFeedback();

  if (result.error)
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(result.error.details[0].message);

  try {
    const result = await feedbackRepository.getSingleFeedback(userId, movieId);
    if (!result) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Feedback not found" });
    }

    return res.status(HttpStatus.OK).json({ data: result });
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};

//no need for a controller because the avg will send to the get movie from repository
// const getAverageUserRatingForMovie = async (movieId) => {
//   try {
//     const result = await feedbackRepository.getAverageUserRatingForMovie(
//       movieId
//     );
//     if (!result) {
//       throw error;
//     }
//     return result;
//   } catch (error) {
//     return res
//       .status(HttpStatus.INTERNAL_SERVER_ERROR)
//       .json({ message: "An error occurred" });
//   }
// };

const updateFeedback = async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;
  const { rating, comment, createdAt } = req.body;
  feedback.userId = userId;
  feedback.movieId = movieId;
  feedback.rating = rating;
  feedback.comment = comment;
  feedback.createdAt = new Date(createdAt).toISOString();
  const result = feedback.validate();
  if (result.error)
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(result.error.details[0].message);

  try {
    const updatedFeedback = await feedbackRepository.updateFeedback(feedback);

    if (!updatedFeedback) {
      throw new Error();
    }

    return res.status(HttpStatus.OK).json({ data: updatedFeedback });
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "An error occurred" });
  }
};

const getAllFeedbackForMovie = async (req, res) => {
  const { movieId } = req.params;
  try {
    const response = await feedbackRepository.getAllFeedbackForMovie(movieId);

    if (!response) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "No user feedbacks for the movie" });
    }

    const modifiedResponse = await modifyFeedbackResponse(response);
    return res.status(HttpStatus.OK).json({ data: modifiedResponse });
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};


const getAllFeedbackForMovieName = async (req, res) => {
  const { name } = req.params;
  try {
    const movieId = movieRepository.getMovieIdByName(name);
    if (!movie) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Movie not found" });
    }

    const response = await feedbackRepository.getAllFeedbackForMovie(movieId);
    if (!response) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "No user feedbacks for the movie" });
    }

    const modifiedResponse = await modifyFeedbackResponse(response);
    return res.status(HttpStatus.OK).json({ data: modifiedResponse });
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};

const getTopBottomFeedbacksForMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const response = await feedbackRepository.getAllFeedbackForMovie(movieId);

    if (!response) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "No user feedbacks for the movie" });
    }

    response.sort((a, b) => a.rating - b.rating);

    let topBottomFeedbacks = response;
    if (response.length > 4) {
       topBottomFeedbacks = [...response.slice(0, 2), ...response.slice(-2)];
    }

    const modifiedResponse = await modifyFeedbackResponse(topBottomFeedbacks);

    return res.status(HttpStatus.OK).json({ data: modifiedResponse });

  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "An error occurred" });
  }
}

const sortFeedback = async (req, res) => {
  const { movieId } = req.params;
  const { option, order } = req.query;

  try {
    const response = await feedbackRepository.getAllFeedbackForMovie(movieId);

    switch (option) {
      case "time":
        switch (order) {
          case "desc":
            response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case "asc":
            response.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        }
        break;
      case "rating":
        switch (order) {
          case "desc":
            response.sort((a, b) => b.rating - a.rating);
            break;
          case "asc":
            response.sort((a, b) => a.rating - b.rating);
            break;
        }
        break;
    }

    const modifiedResponse = await modifyFeedbackResponse(response.slice(0, 4));

    return res.status(HttpStatus.OK).json({ data: modifiedResponse });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};




const modifyFeedbackResponse = async (response) => {
  const modifiedResponse = await Promise.all(
    response.map(async (feedback) => {
      const user = await userRepository.getUserById(feedback.userId);
      const daysAgo =
        Math.floor(
          (new Date() - new Date(feedback.createdAt)) / milisecondsInADay
        ) < 1
          ? "Today"
          : Math.floor(
            (new Date() - new Date(feedback.createdAt)) / milisecondsInADay
          ) + " days ago";
      return {
        name: user.firstName + " " + user.lastName,
        userId: feedback.userId,
        rating: feedback.rating,
        comment: feedback.comment,
        createdAt: daysAgo,
        movieId: feedback.movieId,
      };
    })
  );

  return modifiedResponse;
};

const searchFeedbackByName = async (req, res) => {
  const { name } = req.query;
  try {
    const movie = await movieRepository.findByName(name);  // Implement this in the movie repo
    if (!movie) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Movie not found" });
    }
    const feedbacks = await feedbackRepository.getAllFeedbackForMovie(movie.id);
    return res.status(HttpStatus.OK).json({ data: feedbacks });
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};

const deleteFeedback = async (req, res) => {
  const { movieId, userId } = req.params;
  try {
    await feedbackRepository.deleteFeedback(movieId, userId);  // Implement this in the movie repo
    return res.status(HttpStatus.OK).json(true);
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }

};

export default {
  addFeedback,
  getSingleFeedback,
  updateFeedback,
  getAllFeedbackForMovie,
  getAllFeedbackForMovieName,
  getTopBottomFeedbacksForMovie,
  sortFeedback,
  searchFeedbackByName,
  deleteFeedback
};

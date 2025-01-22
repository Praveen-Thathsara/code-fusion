import { v4 as uuidv4 } from "uuid";

import Rental from "../models/rental.js";
import HttpStatus from "../enums/httpStatus.js";
import rentalRepository from "../repositories/rentalRepository.js";
import movieRepository from "../repositories/movieRepository.js";
import userRepository from "../repositories/userRepository.js";

const rental = new Rental(null, null, null, null, null, null);

//challenge 5.a
const addRental = async (req, res) => {
  // try {
  //   const { movieId, daysRented } = req.body;
  //   rental.id = uuidv4();
  //   rental.userId = req.user.id;
  //   rental.movieId = movieId;
  //   rental.daysRented = daysRented;

  //   const resultValidation = rental.validate();
  //   if (resultValidation.error)
  //     return res
  //       .status(HttpStatus.BAD_REQUEST)
  //       .send(resultValidation.error.details[0].message);

  //   const movie = await movieRepository.getMovieById(movieId);
  //   if (!movie) {
  //     return res
  //       .status(HttpStatus.NOT_FOUND)
  //       .json({ message: "Movie not found" });
  //   }

  //   const user = await userRepository.getUserById(rental.userId);
  //   if (!user) {
  //     return res
  //       .status(HttpStatus.NOT_FOUND)
  //       .json({ message: "User not found" });
  //   }

  //   const response = await getLastRentalService(rental.userId, movieId);
  //   console.log(response.isLastRentalActive);

  //   if (response.isLastRentalActive) {
  //     return res
  //       .status(HttpStatus.BAD_REQUEST)
  //       .json({ message: "There is an active rental for this movie" });
  //   }

  //   const currentDateTimeStamp = new Date().toISOString();

  //   if (currentDateTimeStamp < movie.releaseAt) {
  //     rental.rentedAt = movie.releaseAt;
  //   } else {
  //     rental.rentedAt = currentDateTimeStamp;
  //   }

  //   rental.rentalFee = rental.daysRented * movie.dailyRentalRate;

  //   if (user.balance < rental.rentalFee) {
  //     return res
  //       .status(HttpStatus.BAD_REQUEST)
  //       .json({ message: "Insufficient balance" });
  //   }

  //   const result = await rentalRepository.addRental(rental);
  //   if (!result) {
  //     throw error;
  //   }

  //   return res.status(HttpStatus.CREATED).json({ data: result });
  // } catch (error) {
  //   console.error(error);
  //   return res
  //     .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //     .json({ message: "An error occurred" });
  // }
};

const getRentalByMovieId = async (req, res) => {
  try {
    const id = req.params.id;
    //rental.movieId = id;
    // const validateErrMsg = rental.validateId();
    // if (validateErrMsg)
    //   return res.status(HttpStatus.BAD_REQUEST).send(validateErrMsg);
    const response = await rentalRepository.getRentalByMovieId(id);
    if (!response) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "No rentals found for the movie" });
    }
    return res.status(HttpStatus.OK).json({ data: response });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

const getRentalByUserId = async (req, res) => {
  try {
    const id = req.user.id;
    //rental.userId = id;
    // const validateErrMsg = rental.validateId();
    // if (validateErrMsg)
    //   return res.status(HttpStatus.BAD_REQUEST).send(validateErrMsg);
    const response = await rentalRepository.getRentalByUserId(id);
    if (!response) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "No rentals found for the user" });
    }
    const modifiedResponse = await Promise.all(
      response.map(async (rental) => {
        const movie = await movieRepository.getMovieById(rental.movieId);

        const data = {
          rental,
          movie,
        };
        return data;
      })
    );
    return res.status(HttpStatus.OK).json({ data: modifiedResponse });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

const getRentals = async (req, res) => {
  try {
    const rentals = await rentalRepository.getAllRentals();
    if (rentals && rentals.length == 0) {
      return res.status(HttpStatus.NOT_FOUND).send("Rentals not found");
    }
    return res.status(HttpStatus.OK).json({ data: rentals });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

const deleteRental = async (req, res) => {
  try {
    const id = req.params.id;
    rental.id = id;
    const validateErrMsg = rental.validateId();
    if (validateErrMsg)
      return res.status(HttpStatus.BAD_REQUEST).send(validateErrMsg);
    const result = await rentalRepository.deleteRental(id);
    if (result === "SQL Error") {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: result });
    } else {
      return res.status(HttpStatus.OK).json({ data: result });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("An error occurred");
  }
};

const getLastRentalStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.id;
    rental.userId = userId;
    rental.movieId = movieId;

    const result = rental.validateLastRental();
    if (result.error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(result.error.details[0].message);

    //challenge 5.a
    let lastRental = await getLastRentalService(userId, movieId);

    return res
      .status(HttpStatus.OK)
      .json({ isLastRentalActive: lastRental.isLastRentalActive });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};

//challenge 5.a
const getLastRentalService = async (userId, movieId) => {
  try {
    let rentals = await rentalRepository.getRentalByUserIdAndMovieId(
      userId,
      movieId
    );

    let lastRental = null;

    let isLastRentalActive = false;

    if (!rentals) {
      return { isLastRentalActive };
    }

    rentals.sort((a, b) => new Date(b.rentedAt) - new Date(a.rentedAt));

    lastRental = rentals[0];

    let returnDate = new Date(lastRental.rentedAt);
    returnDate.setDate(returnDate.getDate() + lastRental.daysRented);

    let returnDateOfTheLastRental = returnDate;

    if (new Date() < returnDateOfTheLastRental) {
      isLastRentalActive = true;
    }
    return { isLastRentalActive, lastRental };
  } catch (error) {
    console.log(error);
    return null;
  }
};

//challenge 12.a - part 1
const getUserRentSummary = async (userId) => {
  try {
    const response = await rentalRepository.getRentalByUserId(userId);

    let totalRentExpenditure = 0;
    let totalNoOfDaysRented = 0;

    if (response) {
      response.forEach((rental) => {
        totalRentExpenditure += rental.rentalFee;
        totalNoOfDaysRented += rental.daysRented;
      });
    }

    return { userId, point: [totalRentExpenditure, totalNoOfDaysRented] };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const giftRental = async (req, res) => {
  try {
    rental.id = uuidv4();
    const { receiverEmail, movieId, daysRented } = req.body;

    const receiver = await userRepository.getUserByEmail(receiverEmail);
    if (!receiver) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Receiver not found" });
    }

    const sender = await userRepository.getUserById(req.user.id);
    if (!sender) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Sender not found" });
    }

    const movie = await movieRepository.getMovieById(movieId);
    if (!movie) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Movie not found" });
    }

    const newRentalFee =
      movie.dailyRentalRate * (1 - movie.discountRate) * daysRented;

    if (sender.balance < newRentalFee) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Insufficient balance" });
    }

    rental.userId = receiver.id;
    rental.movieId = movie.id;

    const { isLastRentalActive, lastRental } = await getLastRentalService(
      rental.userId,
      movie.id
    );

    if(isLastRentalActive){
      rental.id = lastRental.id;
      rental.rentedAt = lastRental.rentedAt;
      rental.daysRented = lastRental.daysRented + daysRented;
      rental.rentalFee = lastRental.rentalFee + newRentalFee;
      const result  = await rentalRepository.giftRental(sender.id,rental,newRentalFee,isLastRentalActive);
      if(!result){
        throw new Error("Error updating rental");
      }
      res.status(HttpStatus.OK).json({ data: result });
    }else{
      rental.rentedAt = new Date().toISOString();
      rental.daysRented = daysRented;
      rental.rentalFee = newRentalFee;
      const result = await rentalRepository.giftRental(sender.id, rental,0, false);
      if (!result) {
        throw new Error("Error adding rental");
      }
      res.status(HttpStatus.CREATED).json({ data: result });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};
export default {
  addRental,
  getRentalByMovieId,
  getRentalByUserId,
  getRentals,
  deleteRental,
  getLastRentalStatus,
  getUserRentSummary,
  giftRental,
};

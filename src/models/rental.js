import Joi from "joi";

class Rental {
  constructor(id, userId, movieId, rentalFee, daysRented, rentedAt) {
    this.id = id;
    this.userId = userId;
    this.movieId = movieId;
    this.rentalFee = rentalFee;
    this.daysRented = daysRented;
    this.rentedAt = rentedAt;
  }

  validate() {
    const schema = Joi.object({
      userId: Joi.string().uuid().required(),
      movieId: Joi.string().uuid().required(),
      daysRented: Joi.number().required().min(1),
    });

    return schema.validate({
      userId: this.userId,
      movieId: this.movieId,
      daysRented: this.daysRented,
    });
  }

  validateLastRental() {
    const schema = Joi.object({
      userId: Joi.string().uuid().required(),
      movieId: Joi.string().uuid().required(),
    });

    return schema.validate({
      userId: this.userId,
      movieId: this.movieId,
    });
  }

  validateId() {
    const schema = Joi.object({
      id: Joi.string().uuid().required(),
    });

    const validate = schema.validate({ id: this.id });

    if (validate.error) return validate.error.details[0].message;
  }
}

export default Rental;

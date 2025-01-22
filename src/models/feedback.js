import Joi from "joi";

class Feedback {
  constructor(userId, movieId, rating, comment, createdAt) {
    this.userId = userId;
    this.movieId = movieId;
    this.rating = rating;
    this.comment = comment || null;
    this.createdAt = createdAt;
  }

  validate() {
    const schema = Joi.object({
      userId: Joi.string().uuid().required(),
      movieId: Joi.string().uuid().required(),
      rating: Joi.number().integer().min(0).max(10).required(),
      comment: Joi.string().allow(null),
    });

    return schema.validate({
      userId: this.userId,
      movieId: this.movieId,
      rating: this.rating,
      comment: this.comment,
    });
  }

  validateGetFeedback() {
    const schema = Joi.object({
      userId: Joi.string().uuid().required(),
      movieId: Joi.string().uuid().required(),
    });

    return schema.validate({
      userId: this.userId,
      movieId: this.movieId,
    });
  }
}

export default Feedback;

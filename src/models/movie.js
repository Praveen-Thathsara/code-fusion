import Joi from "joi";

class Movie {
  constructor(
    id,
    title,
    year,
    dailyRentalRate,
    discountRate,
    genres,
    userRating,
    imdbRating,
    posterUrl,
    bannerUrl,
    plot,
    runtime,
    directedBy,
    starring,
    releaseAt,
    isDeleted
  ) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.dailyRentalRate = dailyRentalRate;
    this.discountRate = discountRate;
    this.genres = genres;
    this.userRating = userRating;
    this.imdbRating = imdbRating;
    this.posterUrl = posterUrl;
    this.bannerUrl = bannerUrl;
    this.plot = plot;
    this.runtime = runtime;
    this.directedBy = directedBy;
    this.starring = starring;
    this.releaseAt = releaseAt;
    this.isDeleted = isDeleted;
  }

  validate() {
    const schema = Joi.object({
      title: Joi.string().max(50).required(),
      year: Joi.number().integer().required(),
      dailyRentalRate: Joi.number().required(),
      discountRate: Joi.number(),
      genres: Joi.array().required(),
      imdbRating: Joi.number().min(0).max(10).required(),
      posterUrl: Joi.string().required(),
      bannerUrl: Joi.string().required(),
      plot: Joi.string().required(),
      runtime: Joi.string().max(10).required(),
      directedBy: Joi.string().required(),
      starring: Joi.string().required(),
      releaseAt: Joi.date().required(),
      isDeleted: Joi.boolean().required(),
    });

    return schema.validate({
      title: this.title,
      year: this.year,
      dailyRentalRate: this.dailyRentalRate,
      discountRate: this.discountRate,
      genres: this.genres,
      imdbRating: this.imdbRating,
      posterUrl: this.posterUrl,
      bannerUrl: this.bannerUrl,
      plot: this.plot,
      runtime: this.runtime,
      directedBy: this.directedBy,
      starring: this.starring,
      releaseAt: this.releaseAt,
      isDeleted: this.isDeleted,
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

export default Movie;

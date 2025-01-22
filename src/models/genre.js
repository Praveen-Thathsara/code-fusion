import Joi from "joi";

class Genre {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  validate() {
    const schema = Joi.object({
      name: Joi.string().max(50).required(),
    });

    return schema.validate({ name: this.name });
  }

  validateUpdate() {
    const schema = Joi.object({
      id: Joi.string().uuid().required(),
      name: Joi.string().max(50).required(),
    });

    return schema.validate({
      id: this.id,
      name: this.name,
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

export default Genre;

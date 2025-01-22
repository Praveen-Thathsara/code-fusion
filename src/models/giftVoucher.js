import Joi from "joi";

class GiftVoucher {
  constructor(
    id,
    senderId,
    receiverId,
    amount,
    issuedAt = new Date().toISOString(),
    status = "unclaimed"
  ) {
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.amount = amount;
    this.issuedAt = issuedAt;
    let expiresAt = new Date(issuedAt);
    expiresAt.setDate(expiresAt.getDate() + 14);
    this.expiresAt = expiresAt;
    this.status = status;
  }

  validate() {
    const schema = Joi.object({
      id: Joi.string().uuid().required(),
      senderId: Joi.string().uuid().required(),
      receiverId: Joi.string().uuid().required(),
      amount: Joi.number()
        .required()
        .min(100)
        .message("Amount must be at least 100"),
      issuedAt: Joi.date().required(),
      expiresAt: Joi.date().required(),
      status: Joi.string().required(),
    });

    return schema.validate({
      id: this.id,
      senderId: this.senderId,
      receiverId: this.receiverId,
      amount: this.amount,
      issuedAt: this.issuedAt,
      expiresAt: this.expiresAt,
      status: this.status,
    });
  }
}

export default GiftVoucher;

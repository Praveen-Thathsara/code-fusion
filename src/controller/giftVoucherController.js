import { v4 as uuidv4 } from "uuid";
import GiftVoucher from "../models/giftVoucher.js";
import giftVoucherRepository from "../repositories/giftVoucherRepository.js";
import userRepository from "../repositories/userRepository.js";
import HttpStatus from "../enums/httpStatus.js";

const sendGiftVoucher = async (req, res) => {
  try {
    const senderId = req.user.id;

    const giftVoucher = new GiftVoucher(
      uuidv4(),
      senderId,
      amount,
    );

    if (giftVoucher.validate().error)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: giftVoucher.validate().error.details[0].message });


    if (sender.balance < amount) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Insufficient balance" });
    }

    const response = await giftVoucherRepository.createGiftVoucher(giftVoucher);

    if (!response)
      throw new Error();

    return res
      .status(HttpStatus.CREATED)
      .json({ data: response });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred" });
  }
};

const claimGiftVoucher = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const voucherId = req.params.id;
    const voucher = await giftVoucherRepository.getGiftVoucherById(voucherId);

    if (!voucher) return res.status(HttpStatus.NOT_FOUND).json({ message: "Voucher not found" });

    if(voucher.receiverId !== receiverId) return res.status(HttpStatus.BAD_REQUEST).json({ message: "You are not the receiver of this voucher" });

    if (voucher.status === "claimed") return res.status(HttpStatus.BAD_REQUEST).json({ message: "Voucher already claimed" });
    if (voucher.status === "expired") return res.status(HttpStatus.BAD_REQUEST).json({ message: "Voucher expired" });

    voucher.status = "claimed";
    const response = await giftVoucherRepository.updateGiftVoucherAndUserBalance(voucher);

    if (!response) throw new Error();

    return res.status(HttpStatus.OK).json({ data: response});

  } catch (error) {
    console.log(error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred" });
  }
}

const getGiftVouchersByReceiverId = async (req, res) => {
  try {
    const receiverId = req.user.id;

    return res.status(HttpStatus.OK).json({ data: res.HttpStatus });
  } catch (error) {
    console.log(error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred" });
  }
}

export default { sendGiftVoucher, claimGiftVoucher, getGiftVouchersByReceiverId };

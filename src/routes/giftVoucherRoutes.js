import express from "express";

import giftVoucherController from "../controller/giftVoucherController.js";

const router = express.Router();

const { sendGiftVoucher, claimGiftVoucher, getGiftVouchersByReceiverId } =
  giftVoucherController;

router.post("/", sendGiftVoucher);
router.get("/receiver", getGiftVouchersByReceiverId);
router.patch("/claim/:id", claimGiftVoucher);

export default router;

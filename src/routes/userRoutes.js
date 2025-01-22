import express from "express";
import userController from "../controller/userController.js";
import admin from "../middleware/admin.js";

const {
  updateUser,
  getUser,
  deleteUser,
  getAllUsers,
  getAllUserEmails,
  getUserGroups,
  addBalance,
} = userController;

const router = express.Router();

router.get("/", admin, getAllUsers);
router.get("/emails", getAllUserEmails);
router.get("/groups", admin, getUserGroups);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", admin, deleteUser);
router.post("/add-balance", addBalance);

export default router;

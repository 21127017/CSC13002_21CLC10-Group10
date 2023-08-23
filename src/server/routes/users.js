import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  addDepositRequest,
  addWithdrawRequest,
  denyDepositRequest,
  acceptDepositRequest,
  getAllPendingDepositRequests,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

router.post("/:id/deposit", verifyToken, addDepositRequest);
router.post("/:id/withdraw", verifyToken, addWithdrawRequest);
router.get("/:id/getpending", verifyToken, getAllPendingDepositRequests);
router.get("/:id/:id_transaction/accept", verifyToken, acceptDepositRequest);
router.get("/:id/:id_transaction/deny", verifyToken, denyDepositRequest);

export default router;

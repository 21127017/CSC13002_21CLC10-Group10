import express from "express";
import { getFeedPosts, getUserPosts, likePost, donateUserPosts, deletePost, createComment, deleteComment} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* POST */
router.post("/:userDonate/:userId/posts", verifyToken, donateUserPosts);
router.post("/:id/comments", verifyToken, createComment);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* DELETE*/ 
router.patch("/:id/:user/delete", verifyToken, deletePost);
router.patch("/:id/comments/:commentIndex", verifyToken, deleteComment);


export default router;

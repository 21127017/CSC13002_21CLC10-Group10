import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
      money: 0
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const donateUserPosts = async (req, res) => {
  try {
    const { userDonate, userId } = req.params; // Lấy userDonate và userId từ URL params
    if (userId == userDonate) {
      return res.status(400).json({ message: "Cannot donate to yourself." });
    }
    console.log(req.body);
    const { postId, amount } = req.body; // Lấy postId và amount từ body
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount." });
    }
    console.log(userDonate, userId)

    // Tìm thông tin của người được donate (userDonate) và người thực hiện donate (userId)
    const donorUser = await User.findById(userDonate);
    const recipientUser = await User.findById(userId);

    if (!donorUser.money) {
      donorUser.money = 0;
    }
    if (!recipientUser.money) {
      recipientUser.money = 0;
    }

    // Kiểm tra xem donorUser có đủ tiền để donate hay không
    if (donorUser.money < parsedAmount) {
      return res.status(400).json({ message: "Not enough money to donate." });
    }

    // Trừ tiền của donorUser và cộng tiền cho recipientUser
    if (isNaN(donorUser.money) || isNaN(recipientUser.money)) {
      return res.status(400).json({ message: "Invalid money values." });
    }

    donorUser.money -= parsedAmount;
    recipientUser.money += parsedAmount;

    // Lưu thông tin của donorUser và recipientUser
    await donorUser.save();
    await recipientUser.save();

    // Tìm và cập nhật thông tin bài đăng (post) bằng cách thêm amount vào money
    const post = await Post.findById(postId);
    if (!post.money){
      post.money = 0
    }
    post.money += parsedAmount;
    await post.save();

    const currentDate = new Date();
    const donationHistory = {
      type_: "donate",
      date_: currentDate,
      amount: parsedAmount,
      status: "accepted",
    };
    
    donorUser.depositRequests.push(donationHistory);
    recipientUser.depositRequests.push({
      type_: "receive",
      date_: currentDate,
      amount: parsedAmount,
      status: "accepted",
    });

    await donorUser.save();
    await recipientUser.save();

    return res.status(200).json({ message: "Donation successful." });
  } catch (err) {
    console.error("Error donating:", err);
    return res.status(500).json({ message: "Error donating." });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id, user } = req.params;
    
    // Kiểm tra quyền admin dựa trên location của user
    // const admin = await User.findById(user);
    // if (admin.location !== "admin") {
    //   return res.status(403).json({ message: "Permission denied." });
    // }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ message: "Error deleting post." });
  }
};

export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (!comment){
      return res.status(400).json({ message: "Empty comment." });
    }
    post.comments.push({ userId, comment });
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Error creating comment." });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id, commentIndex } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (commentIndex < 0 || commentIndex >= post.comments.length) {
      return res.status(400).json({ message: "Invalid comment index." });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return res.status(500).json({ message: "Error deleting comment." });
  }
};

import User from "../models/User.js";
import { enqueueDepositRequest, getDepositQueue } from "../queue/queue.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user){
      return res.status(400).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* send deposit request */
export const addDepositRequest = async (req, res) => {
  try {
    const { id } = req.params; 
    const { amount } = req.body;
    console.log(id)
    const user = await User.findById(id);
    // Thêm request vào mảng depositRequests của người dùng
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    //const { amount } = req.body;
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount)) {
      return res.status(400).json({ message: "Invalid amount." });
    }
    const request = {
      type_: "deposit", // Loại giao dịch: deposit
      date_: new Date(), // Ngày giao dịch
      amount: depositAmount,
      status: "pending", // Trạng thái: pending
    };
    console.log(request)
    enqueueDepositRequest(request);
    if (!user.depositRequests) {
      user.depositRequests = [];
    }
    user.depositRequests.push(request);
    await user.save();
    res.status(200).json({ message: "Deposit request added to queue." });
  } catch (err) {
    console.error('Error adding deposit request:', err);
    res.status(500).json({ message: err.message });
  }
};

export const acceptDepositRequest = async (req, res) => {
  try {
    const { id, id_transaction } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const depositRequest = user.depositRequests.find(
      (request) => request._id.toString() === id_transaction
    );

    if (depositRequest) {
      if (depositRequest.status === "pending") {
        depositRequest.status = "accepted";
        if (!user.money) {
          user.money = 0
        }
        if (depositRequest.type_ == "deposit"){
          user.money += depositRequest.amount;
        } else {
          if (user.money < depositRequest.amount){
            depositRequest.status = "denied";
            //res.status(400).json({ message: "Not enough money." });
          } else {
            user.money -= depositRequest.amount;
          }
        }
        await user.save();
        res.status(200).json({ message: "Deposit request accepted." });
      } else {
        res.status(400).json({ message: "Invalid request status." });
      }
    } else {
      res.status(404).json({ message: "Deposit request not found." });
    }
  } catch (err) {
    console.error("Error accepting deposit request:", err);
    res.status(500).json({ message: err.message });
  }
};

export const denyDepositRequest = async (req, res) => {
  try {
    const { id, id_transaction } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const depositRequest = user.depositRequests.find(
      (request) => request._id.toString() === id_transaction
    );

    if (depositRequest) {
      if (depositRequest.status === "pending") {
        depositRequest.status = "denied";
        await user.save();
        res.status(200).json({ message: "Deposit request denied." });
      } else {
        res.status(400).json({ message: "Invalid request status." });
      }
    } else {
      res.status(404).json({ message: "Deposit request not found." });
    }
  } catch (err) {
    console.error("Error denying deposit request:", err);
    res.status(500).json({ message: err.message });
  }
};
////////////////
export const addWithdrawRequest = async (req, res) => {
  try {
    const { id } = req.params; 
    const { amount } = req.body;
    console.log(id)
    const user = await User.findById(id);
    // Thêm request vào mảng depositRequests của người dùng
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    //const { amount } = req.body;
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount)) {
      return res.status(400).json({ message: "Invalid amount." });
    }
    const request = {
      type_: "withdraw", // Loại giao dịch: deposit
      date_: new Date(), // Ngày giao dịch
      amount: depositAmount,
      status: "pending", // Trạng thái: pending
    };
    console.log(request)
    enqueueDepositRequest(request);
    if (!user.depositRequests) {
      user.depositRequests = [];
    }
    user.depositRequests.push(request);
    await user.save();
    res.status(200).json({ message: "Deposit request added to queue." });
  } catch (err) {
    console.error('Error adding deposit request:', err);
    res.status(500).json({ message: err.message });
  }
};

// ... trong một hàm xử lý cho admin
export const getAllPendingDepositRequests = async (req, res) => {
  try {
    const users = await User.find();

    const pendingDepositRequests = users.reduce((acc, user) => {
      const pendingRequests = user.depositRequests.filter(
        (request) => request.status === "pending"
      );

      pendingRequests.forEach((request) => {
        acc.push({
          email: user.email,
          userid: user._id,
          amount: request.amount,
          date_: request.date_,
          type_: request.type_,
          postid: request._id, // Thay 'postid' bằng tên thực tế của trường trong DepositRequestSchema
        });
      });

      return acc;
    }, []);

    console.log(pendingDepositRequests);
    res.status(200).json(pendingDepositRequests);
  } catch (err) {
    console.error("Error getting all pending deposit requests:", err);
    res.status(500).json({ message: err.message });
  }
};



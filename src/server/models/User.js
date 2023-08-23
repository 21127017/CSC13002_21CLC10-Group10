import mongoose from "mongoose";

const DepositRequestSchema = new mongoose.Schema({
  type_: String, // Loại giao dịch: deposit
  date_: Date, // Ngày giao dịch
  amount: Number, // Số tiền
  status: String, // Trạng thái: pending, accepted, denied
});

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    money: Number,
    depositRequests: [DepositRequestSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;

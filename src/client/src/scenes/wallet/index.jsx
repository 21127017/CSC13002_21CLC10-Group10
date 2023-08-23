import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // Add this import
import useMediaQuery from "@mui/material/useMediaQuery"; // Add this import
import Navbar from "scenes/navbar";
import WidgetWrapper from "components/WidgetWrapper";
import UserWidget from "scenes/widgets/UserWidget";
import { useNavigate } from "react-router-dom";

const WalletPage = () =>  {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(0);
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const handleDeposit = () => {
    const newTransaction = { type: "deposit", amount, date: new Date() };
    setTransactions([...transactions, newTransaction]);
    setAmount(0);

    // Navigate to the deposit page
    navigate("/deposit");
  };

  const handleWithdraw = () => {
    const newTransaction = { type: "withdraw", amount: -amount, date: new Date() };
    setTransactions([...transactions, newTransaction]);
    setAmount(0);

    // Navigate to the withdraw page
    navigate("/withdraw");
  };

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <h2>Wallet Page</h2>
      {/* Transaction history log */}
      <WidgetWrapper>
          <Typography color="primary" fontWeight="500">
            Wallet Amount: ${user.money}
            <button onClick={handleDeposit}>Deposit</button>
            <button onClick={handleWithdraw}>Withdraw</button>
          </Typography>
          {/* Add other wallet-related content here */}
        </WidgetWrapper>
      <div>
        <h3>Transaction History</h3>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index}>
              {transaction.type}: {transaction.amount} - {transaction.date.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
      {/* Deposit and Withdraw buttons */}
      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        
        
      </div>
    </div>
  );
}

export default WalletPage;

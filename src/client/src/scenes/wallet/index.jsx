import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Divider,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import { useNavigate } from "react-router-dom";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const WalletPage = () => {
  const navigate = useNavigate();
  const [depositRequests, setDepositRequests] = useState([]);
  const [amount, setAmount] = useState(0);
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const getDepositRequests = async () => {
    const response = await fetch(`http://localhost:3001/users/${_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setDepositRequests(data.depositRequests.reverse());
  };

     // Sử dụng useState để theo dõi chiều cao màn hình
     const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

     // Cập nhật chiều cao màn hình khi cửa sổ được thay đổi
     const handleResize = () => {
       setWindowHeight(window.innerHeight);
     };

  useEffect(() => {
    getUser();
    getDepositRequests();
    window.addEventListener("resize", handleResize);
     return () => {
       window.removeEventListener("resize", handleResize);
     };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeposit = () => {
    const newTransaction = { type: "deposit", amount, date: new Date() };
    setDepositRequests([...depositRequests, newTransaction]);
    setAmount(0);

    // Navigate to the deposit page
    navigate("/deposit");
  };

  const handleWithdraw = () => {
    const newTransaction = { type: "withdraw", amount: amount, date: new Date() };
    setDepositRequests([...depositRequests, newTransaction]);
    setAmount(0);

    // Navigate to the withdraw page
    navigate("/withdraw");
  };

  if (!user) return null;
 
   const maxHeight = `${(windowHeight * 0.8)}px`;

  return (
    <div>
      <Navbar />
      {/* User widget and wallet amount */}
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box sx={{ maxHeight, overflowY: "auto" }} flexBasis={isNonMobileScreens ? "42%" : undefined }
          mt={isNonMobileScreens ? undefined : "2rem"}>
          {/* <h2>Wallet Page</h2> */}
          <Paper elevation={3} sx={{ padding: 2 }}>
            {/* Top Section */}
            <Box textAlign="center" mb={2} >
              <Typography variant="h3" fontWeight="bold" color="common">Wallet Amount: ${user.money || 0}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* Middle Section: Deposit and Withdraw Buttons */}
            <Box display="flex" justifyContent="center">
              <Button variant="contained" color="primary" onClick={handleDeposit} sx={{ m: 1 }}>
                Deposit
              </Button>
              <Button variant="contained" color="secondary" onClick={handleWithdraw} sx={{ m: 1 }}>
                Withdraw
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* Bottom Section */}
            <Box>
              <Typography variant="h3" fontWeight="bold" color="common">Transaction History</Typography>
              <Box display="flex" flexDirection="column" gap="0.5rem">
              {depositRequests.map((transaction, index) => (
                <Paper
                  key={index}
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "10px",
                    paddingTop: "15px",
                    paddingLeft: "30px",
                    paddingRight: "30px",
                    borderRadius: "60px",
                    backgroundColor: transaction.status === "pending" ? "#d19d4d" : 
                                      transaction.status === "denied" ? "#EF9A9A" : "#C8E6C9",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <Typography variant="h6" fontWeight="bold" color="common">
                        {transaction.type_}
                      </Typography>
                      <Typography variant="h7" color="common">
                        {new Date(transaction.date_).toLocaleString()}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h8" textAlign="right" color="common" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                        {transaction.status}
                      </Typography>
                      <Typography variant="h6" textAlign="right" color="common">
                        ${transaction.amount}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              ))}
              </Box>
            </Box>
          </Paper>
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="24%" sx={{ maxHeight, overflowY: "auto" }}>
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default WalletPage;

import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";

const PendingRequests = () => {
  const token = useSelector((state) => state.token);
  const _id = useSelector((state) => state.user._id);

  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách yêu cầu pending
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${_id}/getpending`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data);
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const handleAccept = async (userid, id_transaction) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userid}/${id_transaction}/accept`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Cập nhật danh sách yêu cầu sau khi chấp nhận
        fetchPendingRequests();
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDeny = async (userid, id_transaction) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userid}/${id_transaction}/deny`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Cập nhật danh sách yêu cầu sau khi từ chối
        fetchPendingRequests();
      }
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  return (
    <div>
      <Navbar/>
      <Box padding="2rem 6%">
      <h2>Pending Deposit Requests</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {pendingRequests.map((request) => (
          <TableRow key={request.userid}>
            <TableCell>{request.email}</TableCell>
            <TableCell>{request.amount}</TableCell>
            <TableCell>{request.date_}</TableCell>
            <TableCell>{request.type_}</TableCell>
            <TableCell>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleAccept(request.userid, request.postid)}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDeny(request.userid, request.postid)}
              >
                Deny
              </Button>
            </TableCell>
          </TableRow>
        ))}

          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </div>
  );
};

export default PendingRequests;

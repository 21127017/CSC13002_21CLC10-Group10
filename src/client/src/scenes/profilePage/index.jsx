import React from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import {
  Search,
  DarkMode,
  LightMode,
  Menu,
  Close,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const loggedInUser = useSelector((state) => state.user); // Lấy thông tin user đang đăng nhập

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

  const isAdminViewing = loggedInUser.location === "admin"; // Kiểm tra nếu user đang xem là admin

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
        <Typography
            //fontWeight="bold"
            fontWeight="bold"
            fontStyle="italic"
            sx={{ fontSize: 25, m: 1 }}
            color="primary"
          >
            Profile
          </Typography>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {/* Các phần tử khác trong bố cục */}
              {isAdminViewing && (
                <Box
                  textAlign="center"  // Căn giữa theo chiều ngang
                  mb={2}
                  fontWeight="bold"
                  sx={{
                    fontSize: 25,
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                    padding: "10px",
                    display: "inline-block",
                  }}
                  color="purple"
                >
                  <Typography fontWeight="bold" sx={{ fontSize: 25, m: 1 }} color="common"> 
                    User Wallet Amount: ${user.money || 0}
                  </Typography>
                </Box>
              )}
            </Box>

          <Box m="2rem 0" />
          
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;

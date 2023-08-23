import React from 'react';
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
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

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

   // Sử dụng useState để theo dõi chiều cao màn hình
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

  // Cập nhật chiều cao màn hình khi cửa sổ được thay đổi
  const handleResize = () => {
    setWindowHeight(window.innerHeight);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const maxHeight = `${(windowHeight * 0.8)}px`;

  return (
    <Box >
      <Navbar />
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
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          sx={{ maxHeight, overflowY: "auto" }}
        >
          <MyPostWidget picturePath={picturePath} />
          <Typography
            //fontWeight="bold"
            fontWeight="bold"
            fontStyle="italic"
            sx={{ fontSize: 25, m: 2 }}
            color="primary"
            paddingTop={2}
          >
            Welcome to NewsFeed🎉🎉
          </Typography>
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%" sx={{ maxHeight, overflowY: "auto" }}>
            <AdvertWidget />
            <Box m="2rem 0" />
            <Box >
            <FriendListWidget userId={_id} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
